import { h, Component } from "preact"
import Select from "react-select"

const censusTracts = [
  { value: 1, label: "One" },
  { value: 2, label: "Two" },
  { value: 3, label: "Three" },
];

export default class Filters extends Component {

  handleChange = (name) => (opt) => {
    this.setState({
      [name]: (opt && opt.value) || null,
    })
  }

  resetFilters = () => {
    this.setState({
      tract: null,
      topic: null,
      indicator: null,
      year: null,
    });
  }

  render() {
    const { tract, topic, indicator, year } = this.state;

    return (
      <div className="Filters">
        <div className="container">

          <div className="Filters-row">
            <Select name="tract" placeholder="Tract" options={censusTracts} onChange={this.handleChange("tract")} value={tract} />
            <Select name="topic" placeholder="Topic" options={censusTracts} onChange={this.handleChange("topic")} value={topic} />
            <Select name="indicator" placeholder="Indicator" options={censusTracts} onChange={this.handleChange("indicator")} value={indicator} />
            <Select name="year" placeholder="Year" options={censusTracts} onChange={this.handleChange("year")} value={year} />
          </div>

          <div className="Filters-row right">
            <button type="submit" className="Filters-set-filters">Explore Data</button>
            <button type="button" className="Filters-reset-filters" onClick={this.resetFilters}>Clear All</button>
          </div>

        </div>
      </div>
    );
  }

}
