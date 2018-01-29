import { h, Component } from "preact";
import qs from "query-string";
import Promise from "bluebird";

import Map from "./Map";
import DataTable from "./DataTable";

import {
  dataSourceKey,
  fetchDataSource,
  fetchMetadataSource,

  fetchFilters,

  choroplethRows,
  choroplethColorStops,
} from "../lib/data";

import {
  equalIntervals,
} from "../lib/classifiers";

const filterObject = (obj, predicate) => {
  return Object.keys(obj).reduce((all, key) => (
    predicate(obj[key]) ? { ...all, [key]: obj[key] } : all
  ), {});
};

export default class App extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
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
    choroplethSteps: [],
    choroplethColorStops: [],
  }

  componentWillMount() {
    fetchFilters().then(filters => this.setState({ filters }));
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
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

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setSearchFromFilters = (resolve = () => {}) => () => {
    const search = filterObject(this.state.selectedFilters, v => !!v);
    window.history.pushState({}, null, "?" + qs.stringify(search));

    return resolve();
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
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
        }

        // recalculate choropleth values when year is cleared
        let steps = [ ...this.state.choroplethSteps ]
        let colorStops = [ ...this.state.choroplethColorStops ];

        if (selectedFilters.indicator) {
          const { geography, topic, indicator, year } = selectedFilters;

          const dataKey = dataSourceKey(geography, topic);
          const data = this.state.dataSources[dataKey];
          const rows = choroplethRows(data, geography, indicator, year);

          steps = equalIntervals(rows.map(row => row[indicator]));
          colorStops = choroplethColorStops(rows, steps, geography, indicator);
        }

        return this.setState({
          selectedFilters,
          choroplethSteps: steps,
          choroplethColorStops: colorStops,
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
        const { selectedFilters, selectedFilters: { geography, topic } } = this.state;
        const indicator = filter === "indicator" ? value : selectedFilters.indicator;
        const year = filter === "year" ? value : selectedFilters.year;

        const dataKey = dataSourceKey(geography, topic);
        const data = this.state.dataSources[dataKey];

        const rows = choroplethRows(data, geography, indicator, year);
        const steps = equalIntervals(rows.map(row => row[indicator]));
        const colorStops = choroplethColorStops(rows, steps, geography, indicator);

        const newFilters = filter === "indicator"
          ? { "indicator": value, year: null }
          : { year: value };

        return this.setState({
          choroplethSteps: steps,
          choroplethColorStops: colorStops,
          selectedFilters: { ...this.state.selectedFilters, ...newFilters },
        }, this.setSearchFromFilters(resolve));
      }

    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
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

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setArea = (area, areaProps) => {
    this.setState({ area, areaProps });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  toggleAreaLock = () => {
    this.setState({ areaLocked: !this.state.areaLocked });
  }

  render() {
    const {
      filters,
      selectedFilters,
      area, areaProps, areaLocked,
      dataSources, metadataSources,
      choroplethSteps, choroplethColorStops,
    } = this.state;
    const { geography, topic } = selectedFilters;

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
            onLoad={this.setSelectedFiltersFromQueryString}
            selectedFilters={selectedFilters}
            setArea={this.setArea}
            toggleAreaLock={this.toggleAreaLock}
            setFilter={this.setFilter}
          />

          <DataTable
            selectedFilters={selectedFilters}
            area={area}
            areaProps={areaProps}
            data={data}
            metadata={metadata}
          />
        </div>
      </div>
    );
  }

}
