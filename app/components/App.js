import { h, Component } from "preact";

import Filters from "./Filters";
import Map from "./Map";
import DataTable from "./DataTable";

import {
  dataSourceKey,
  fetchDataSource,
  fetchMetadataSource,
  indicators,
  years,
} from "../lib/data";

export default class App extends Component {

  // componentDidMount() {
  //   this.setFilter("geography", "TR10");
  //   this.setFilter("topic", "crime");
  // }

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
  }

  // Filter management
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
        fetchDataSource(geography, value)
        .then(data => {
          this.setState({
            dataSources: {
              ...this.state.dataSources,
              [dataKey]: data,
            },
          });
        });

        fetchMetadataSource(geography, value)
        .then(data => {
          this.setState({
            metadataSources: {
              ...this.state.metadataSources,
              [dataKey]: data,
            },
          });
        });
      }
    }

    this.setState({
      filters: {
        ...this.state.filters,
        [filter]: value,
      },
    });
  }

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

  // Area management
  setArea = (area, areaProps) => {
    this.setState({ area, areaProps });
  }

  render() {
    const { filters, area, areaProps, dataSources, metadataSources } = this.state;
    const { geography, topic } = filters;

    const dataKey = dataSourceKey(geography, topic);
    const data = dataSources[dataKey];
    const metadata = metadataSources[dataKey];

    return (
      <div className="App">
        <Filters
          filters={filters}
          setFilter={this.setFilter}
          clearFilters={this.clearFilters}
          data={data}
          metadata={metadata}
        />

        <Map
          geography={geography}
          area={area}
          setArea={this.setArea}
        />

        <DataTable
          filters={filters}
          area={area}
          areaProps={areaProps}
          data={data}
          metadata={metadata}
        />
      </div>
    );
  }

}
