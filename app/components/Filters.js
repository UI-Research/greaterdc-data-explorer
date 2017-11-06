import { h, Component } from "preact"
import Select from "react-select"

const censusTracts = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
];

export default class Filters extends Component {

  handleFilterChange = (name) => (opt) => {
    this.setState({
      [name]: (opt && opt.value) || null,
    })
  }

  render() {
    const { tract, topic, indicator, year } = this.state;

    return (
      <div className="Filters">
        <div className="container">
          <div className="row">
            <input type="text" className="wide" placeholder="Address" />
            <Select
              name="tract"
              placeholder="Tract"
              options={censusTracts}
              onChange={this.handleFilterChange("tract")}
              value={tract}
            />
          </div>

          <div className="row">
            <Select name="topic" placeholder="Topic" options={censusTracts} onChange={this.handleFilterChange("topic")} value={topic} />
            <Select name="indicator" placeholder="Indicator" options={censusTracts} onChange={this.handleFilterChange("indicator")} value={indicator} />
            <Select name="year" placeholder="Year" options={censusTracts} onChange={this.handleFilterChange("year")} value={year} />
            <button type="submit">Explore Data</button>
          </div>
        </div>
      </div>
    );
  }

}
