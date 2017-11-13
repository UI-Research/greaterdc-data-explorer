import { h, Component } from "preact";
import Select from "react-select";

import {
  geographyOptions,
  topicOptions,
  topicPlaceholders,
  indicatorOptions,
  yearOptions,
} from "../constants/filters";

export default class Filters extends Component {

  handleChange = (name) => (opt) => {
    this.setState({
      [name]: (opt && opt.value) || null,
    }, () => this.props.onUpdate(this.state));

    if (name == "geography" && !opt) {
      this.resetFilters();
    }
  }

  resetFilters = () => {
    this.setState({
      geography: null,
      topic: null,
      indicator: null,
      year: null,
    }, () => this.props.onUpdate(this.state));
  }

  render() {
    const { geography, topic, indicator, year } = this.state;
    const yearOpts = yearOptions(geography, topic, indicator);

    return (
      <div className="Filters">
        <div className="container">

          <div className="Filters-row">
            <Select
              name="geography"
              placeholder="Geography"
              options={geographyOptions}
              onChange={this.handleChange("geography")}
              value={geography}
            />

            <Select
              name="topic"
              placeholder={topicPlaceholders[geography] || "Please select geography"}
              disabled={!geography}
              options={topicOptions[geography] || []}
              onChange={this.handleChange("topic")}
              value={topic}
            />

            <Select
              name="indicator"
              placeholder={topic ? "Indicator" : "Please select topic"}
              disabled={!topic}
              options={indicatorOptions[topic] || []}
              onChange={this.handleChange("indicator")}
              value={indicator}
            />

            <Select
              name="year"
              placeholder="Year"
              disabled={yearOpts.length == 0}
              options={yearOpts}
              onChange={this.handleChange("year")}
              value={year}
            />
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
