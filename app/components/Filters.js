import { h, Component } from "preact";
import Select from "react-select";

import {
  geographyOptions,
  topicOptions,
} from "../support/filters";

import {
  indicators,
  years,
} from "../lib/data";

export default class Filters extends Component {

  componentDidUpdate(prevProps) {
    const { topic, data, metadata } = this.props;
    const { topic: prevTopic, data: prevData } = prevProps;

    if ((prevTopic !== topic) || (!prevData && data)) {
      const yearOpts = years(data);

      this.props.setFilter("indicator", indicators(data, metadata)[0].value);
      this.props.setFilter("year", yearOpts[yearOpts.length - 1].value);
    }
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  handleChange = (name) => (opt) => {
    this.props.setFilter(name, (opt && opt.value));
  }

  render() {
    const { clearFilters, filters, data, metadata } = this.props;
    const { geography, topic, indicator, year } = filters;

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
            <button type="button" className="Filters-reset-filters" onClick={clearFilters}>Clear All</button>
          </div>

        </div>
      </div>
    );
  }

}
