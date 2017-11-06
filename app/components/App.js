import { h, Component } from "preact";

import Filters from "./Filters"
import Map from "./Map"
import DataTable from "./DataTable"

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <Filters />
        <Map />
        <DataTable />
      </div>
    );
  }

}
