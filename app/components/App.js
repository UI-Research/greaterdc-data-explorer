import { h, Component } from "preact";
// import axios from "axios";

import Filters from "./Filters";
import Map from "./Map";
import DataTable from "./DataTable";

export default class App extends Component {

  state = {
    filters: {},
  }

  setFilters = (filters) => {
    this.setState({ filters });
  }

  render() {
    const { filters } = this.state;

    return (
      <div className="App">
        <Filters onUpdate={this.setFilters} />
        <Map geography={filters.geography} />
        <DataTable />
      </div>
    );
  }

}
