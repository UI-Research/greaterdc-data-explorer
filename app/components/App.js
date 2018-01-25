import { h, Component } from "preact";

import Filters from "./Filters";
import Map from "./Map";
import DataTable from "./DataTable";

import {
  dataSourceKey,
  fetchDataSource,
  fetchMetadataSource,

  choroplethRows,
  choroplethColorStops,
} from "../lib/data";

import {
  equalIntervals,
} from "../lib/classifiers";

export default class App extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  state = {
    filters: {
      geography: null,
      topic: null,
      indicator: null,
      year: null,
    },
    area: null,
    areaProps: null,
    dataSources: {},
    metadataSources: {},
    choroplethSteps: [],
    choroplethColorStops: [],
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setFilter = (filter, value) => {
    // when clearing geography, clear every other filter and area
    if (filter === "geography" && !value) {
      this.clearFilters();
      this.setArea(null, null);
      return;
    }

    // if changing geography, invalidate selected area and filters
    if (filter === "geography" && value && value !== this.state.filters.geography) {
      this.clearFilters();
      this.setArea(null, null);
    }

    if (filter === "topic" && value) {
      const { filters: { geography }, dataSources } = this.state;
      const dataKey = dataSourceKey(geography, value);

      if (!dataSources[dataKey]) {
        Promise.all([
          fetchDataSource(geography, value),
          fetchMetadataSource(geography, value),
        ])
        .then(([ data, metadata ]) => {
          const { dataSources, metadataSources } = this.state;

          this.setState({
            dataSources: { ...dataSources, [dataKey]: data },
            metadataSources: { ...metadataSources, [dataKey]: metadata },
          });
        });
      }
    }

    // calculate choropleth data if indicator / year changes
    if (filter === "indicator" || filter === "year") {
      const { filters, filters: { geography, topic } } = this.state;
      const indicator = filter === "indicator" ? value : filters.indicator;
      const year = filter === "year" ? value : filters.year;

      const dataKey = dataSourceKey(geography, topic);
      const data = this.state.dataSources[dataKey];

      const rows = choroplethRows(data, geography, indicator, year);
      const steps = equalIntervals(rows.map(row => row[indicator]));
      const colorStops = choroplethColorStops(rows, steps, geography, indicator);

      this.setState({
        choroplethSteps: steps,
        choroplethColorStops: colorStops,
      });
    }

    this.setState({
      filters: {
        ...this.state.filters,
        [filter]: value,
      },
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  clearFilters = () => {
    this.setState({
      filters: {
        geography: null,
        topic: null,
        indicator: null,
        year: null,
      },
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setArea = (area, areaProps) => {
    this.setState({ area, areaProps });
  }

  render() {
    const {
      filters, area, areaProps, dataSources, metadataSources, choroplethSteps, choroplethColorStops,
    } = this.state;
    const { geography, topic } = filters;

    const dataKey = dataSourceKey(geography, topic);
    const data = dataSources[dataKey];
    const metadata = metadataSources[dataKey];

    return (
      <div className="greater-dc-data-explorer">
        <div className="App">
          <Filters
            filters={filters}
            setFilter={this.setFilter}
            clearFilters={this.clearFilters}
            data={data}
            metadata={metadata}
          />

          <Map
            filters={filters}
            area={area}
            setArea={this.setArea}
            data={data}
            metadata={metadata}
            choroplethSteps={choroplethSteps}
            choroplethColorStops={choroplethColorStops}
          />

          <DataTable
            filters={filters}
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
