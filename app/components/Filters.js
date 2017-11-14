import { h, Component } from "preact";
import Select from "react-select";

import {
  geographyOptions,
  topicOptions,
} from "../constants/filters";

import { indicators, years } from "../lib/data";

export default class Filters extends Component {

  handleChange = (name) => (opt) => {
    this.props.setFilter(name, (opt && opt.value));
  }

  render() {
    const { clearFilters, filters, data, metadata } = this.props;
    const { geography, topic, indicator, year } = filters;

    const indicatorOpts = indicators(data);
    const yearOpts = years(data);

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
              placeholder={geography ? "Topic" : "Please select geography"}
              disabled={!geography}
              options={topicOptions[geography] || []}
              onChange={this.handleChange("topic")}
              value={topic}
            />

            <Select
              name="indicator"
              placeholder={topic ? "Indicator" : "Please select topic"}
              disabled={!topic}
              options={indicators(data, metadata)}
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
            <button type="button" className="Filters-reset-filters" onClick={clearFilters}>Clear All</button>
          </div>

        </div>
      </div>
    );
  }

}
