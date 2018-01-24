import { h, Component } from "preact";
import Select from "react-select";
import map from "lodash.map";

import { geographyOptions } from "../support/filters";

export default class Filters extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  handleChange = (name) => (opt) => {
    this.props.setFilter(name, (opt && opt.value));
  }

  render() {
    const { filters, selectedFilters, clearFilters } = this.props;
    const { geography, topic, indicator, year } = selectedFilters;

    if (!filters) return null;

    const topicOptions = geography
      ? map(filters[geography].topics, ({ label, value }) => ({ label, value }))
      : [];

    const indicatorOptions = geography && topic
      ? map(filters[geography].topics[topic].indicators, ({ label, value }) => ({ label, value }))
      : [];

    const yearOptions = geography && topic && indicator
      ? filters[geography].topics[topic].indicators[indicator].years
      : [];

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
              options={topicOptions}
              onChange={this.handleChange("topic")}
              value={topic}
            />

            <Select
              name="indicator"
              placeholder={topic ? "Indicator" : "Please select topic"}
              disabled={!topic}
              options={indicatorOptions}
              onChange={this.handleChange("indicator")}
              value={indicator}
            />

            <Select
              name="year"
              placeholder="Year"
              disabled={yearOptions.length == 0}
              options={yearOptions}
              onChange={this.handleChange("year")}
              value={year}
            />
          </div>

          <div className="Filters-row right">
            <button type="button" className="Filters-reset-filters" onClick={clearFilters}>Clear All</button>
          </div>

        </div>
      </div>
    );
  }

}
