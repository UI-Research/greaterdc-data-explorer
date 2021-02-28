import React, { Component } from "react";
import qs from "query-string";
import Promise from "bluebird";
import some from "lodash.some";

import Map from "./components/Map";
import DataTable from "./components/DataTable";
import Modal from "./components/Modal";

import {
  dataSourceKey,
  fetchDataSource,
  fetchMetadataSource,

  fetchFilters,
  fetchHelpText,

  choroplethRows,
  choroplethColorStops,
} from "./lib/data";

import {
  quantileIntervals,
} from "./lib/classifiers";

import './App.scss'

const filterObject = (obj, predicate) => {
  return Object.keys(obj).reduce((all, key) => (
    predicate(obj[key]) ? { ...all, [key]: obj[key] } : all
  ), {});
};

const HAS_VISITED = "gdc-has-visted";

export default class App extends Component {

  state = {
    selectedFilters: {
      geography: null,
      topic: null,
      indicator: null,
      year: null,
    },
    filters: null,
    area: null,
    areaProps: null,
    areaLocked: false,
    dataSources: {},
    metadataSources: {},
    notesAndSources: [],
    choroplethSteps: [],
    choroplethColorStops: [],
    modalOpen: false,

  }

  componentDidMount() {
    this.checkFirstVisit();
    fetchFilters().then(filters => this.setState({ filters }));
    fetchHelpText().then(notesAndSources => this.setState({ notesAndSources }));
  }

  checkFirstVisit() {
    if (window.localStorage.getItem(HAS_VISITED) === null) {
      window.localStorage.setItem(HAS_VISITED, true);
      this.setState({ modalOpen: true});
    }
  }

  setSelectedFiltersFromQueryString = () => {
    const selectedFilters = qs.parse(window.location.search);
    const { geography, topic, indicator, year } = selectedFilters;

    this
    .setFilter("geography", geography)
    .then(() => { if (topic) return this.setFilter("topic", topic); })
    .then(() => { if (indicator) return this.setFilter("indicator", indicator); })
    .then(() => { if (year) return this.setFilter("year", year); })
    .catch(e => { throw new Error(`error in setSelectedFiltersFromQueryString chain ${e.message}`); });
  }

  setSearchFromFilters = (resolve = () => {}) => () => {
    const search = filterObject(this.state.selectedFilters, v => !!v);
    window.history.pushState({}, null, "?" + qs.stringify(search));

    return resolve();
  }

  setFilter = (filter, value) => {
    return new Promise(resolve => {

      // when clearing geography, clear every other filter and area
      if (filter === "geography" && !value) {
        this.clearFilters();
        this.setArea(null, null);

        this.setSearchFromFilters(resolve);
        return;
      }

      // when clearing other values
      if (value === null) {
        let selectedFilters = { ...this.state.selectedFilters };
        switch (filter) {
        case "topic":
          selectedFilters = { ...selectedFilters, topic: null, indicator: null, year: null };
          break;
        case "indicator":
          selectedFilters = { ...selectedFilters, indicator: null, year: null };
          break;
        case "year":
          selectedFilters = { ...selectedFilters, year: null };
          break;
        default:
        }

        return this.setState({
          selectedFilters,
          choroplethSteps: [],
          choroplethColorStops: [],
        }, this.setSearchFromFilters(resolve));
      }

      // if changing geography, invalidate selected area and filters
      if (filter === "geography" && value !== this.state.selectedFilters.geography) {
        this.setState({
          selectedFilters: { geography: value, topic: null, indicator: null, year: null },
          area: null,
          areaProps: null,
        }, this.setSearchFromFilters(resolve));
      }

      // change topic
      if (filter === "topic") {
        const { selectedFilters: { geography }, dataSources } = this.state;
        const dataKey = dataSourceKey(geography, value);

        if (!dataSources[dataKey]) {
          return Promise.all([
            fetchDataSource(geography, value),
            fetchMetadataSource(geography, value),
          ])
          .then(([ data, metadata ]) => {
            const { dataSources, metadataSources, selectedFilters: { geography } } = this.state;

            return this.setState({
              dataSources: { ...dataSources, [dataKey]: data },
              metadataSources: { ...metadataSources, [dataKey]: metadata },
              selectedFilters: { geography, topic: value, indicator: null, year: null },
            }, this.setSearchFromFilters(resolve));
          });
        }
        else {
          return this.setState({
            selectedFilters: { geography, topic: value, indicator: null, year: null },
          }, this.setSearchFromFilters(resolve));
        }
      }

      // calculate choropleth data if indicator / year changes
      if (filter === "indicator" || filter === "year") {
        const { filters, selectedFilters, selectedFilters: { geography, topic } } = this.state;
        const indicator = filter === "indicator" ? value : selectedFilters.indicator;
        const year = filter === "year"
          ? value
          : filters[geography].topics[topic].indicators[value].years[0].value;

        const dataKey = dataSourceKey(geography, topic);
        const data = this.state.dataSources[dataKey];

        const rows = choroplethRows(data, geography, indicator, year);
        const classifierSteps = some(rows, r => r.indc ? r.indc === 0 : true) ? 5 : 4;
        const steps = quantileIntervals(rows.map(row => row[indicator]), classifierSteps)

        const colorStops = choroplethColorStops(rows, steps, geography, indicator);

        const newFilters = filter === "indicator"
          ? { indicator: value, year }
          : { year: value };

        return this.setState({
          choroplethSteps: steps,
          choroplethColorStops: colorStops,
          selectedFilters: { ...this.state.selectedFilters, ...newFilters },
        }, this.setSearchFromFilters(resolve));
      }

    });
  }

  clearFilters = () => {
    this.setState({
      selectedFilters: {
        geography: null,
        topic: null,
        indicator: null,
        year: null,
      },
    }, () => {
      window.history.pushState({}, null, window.location.pathname);
    });
  }

  setArea = (area, areaProps) => {
    this.setState({ area, areaProps });
  }

  toggleAreaLock = () => {
    this.setState({ areaLocked: !this.state.areaLocked });
  }

  setSelectedTab = (selectedTab) => this.setState({ selectedTab });

  handleInfoClick = (level, item) => {
    if (this.state.notesAndSources.length === 0) return;

    this.setState({ selectedTab: "notes" }, () => {
      const node = document.querySelector(`#${level}-${item}`);

      if (node) node.scrollIntoView();
    });
  }

  scrollToTable = () => {
    document.querySelector(".DataTable").scrollIntoView();
  }

  openModal = () => this.setState({ modalOpen: true });
  closeModal = () => this.setState({ modalOpen: false });

  render() {
    const {
      filters,
      selectedFilters, selectedFilters: { geography, topic },
      area, areaProps, areaLocked,
      dataSources, metadataSources, notesAndSources,
      choroplethSteps, choroplethColorStops,
      selectedTab,
      modalOpen,
    } = this.state;
    const dataKey = dataSourceKey(geography, topic);
    const data = dataSources[dataKey];
    const metadata = metadataSources[dataKey];
    return (
      <div className="greater-dc-data-explorer">
        <div className="App">
          <Map
            area={area}
            areaProps={areaProps}
            areaLocked={areaLocked}
            choroplethColorStops={choroplethColorStops}
            choroplethSteps={choroplethSteps}
            clearFilters={this.clearFilters}
            data={data}
            filters={filters}
            metadata={metadata}
            notesAndSources={notesAndSources}
            onLoad={this.setSelectedFiltersFromQueryString}
            selectedFilters={selectedFilters}
            setArea={this.setArea}
            toggleAreaLock={this.toggleAreaLock}
            setFilter={this.setFilter}
            onInfoClick={this.handleInfoClick}
            onAboutAppClick={this.openModal}
          />

          <button className="scroll-to-table" onClick={this.scrollToTable}>
            Scroll to table
          </button>

          <DataTable
            selectedFilters={selectedFilters}
            area={area}
            areaProps={areaProps}
            data={data}
            metadata={metadata}
            notesAndSources={notesAndSources}
            selectedTab={selectedTab}
            setSelectedTab={this.setSelectedTab}
            onInfoClick={this.handleInfoClick}
          />

          <Modal isOpen={modalOpen} onRequestClose={this.closeModal}>
            <h2>Welcome to the Urban–Greater DC Data Explorer</h2>
            <p> This interactive map allows you to see data related to education, jobs, basic needs, affordable housing, health, and more across the region. We will add additional data and functionality in the coming months, including more regional data on these topics.</p>
            <p> Click <a
                href="https://greaterdc.urban.org/sites/default/files/2018-05/UrbanGreaterDCMethodology.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >here</a> to download the Data Explorer methodology and notes documentation.</p>
            <p>If there are data you would like to see added to the explorer, please let us know at <a href="mailto:greaterdc@urban.org">greaterdc@urban.org</a>.</p>
          </Modal>
        </div>
      </div>
    );
  }

}
