import { h, Component } from "preact";
import Select from "react-select";
import map from "lodash.map";

import { hasNotesAndSources } from "../lib/data";

import { geographyOptions } from "../support/filters";

export default class Filters extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  handleChange = (name) => (opt) => {
    this.props.setFilter(name, (opt && opt.value));
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  handleInfoClick = (level, item, ev) => {
    // TODO: Connect this with whatever shows notes & sources
    // TODO: Prevent select from opening when info is clicked
    ev.preventDefault();
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  renderOptions = (type) => (selectedOption) => {
    return (
      <div>
        {hasNotesAndSources(this.props.notesAndSources, type, selectedOption.value) &&
          <span
            className="info-button"
            onClick={(ev) => {
              ev.preventDefault();
              this.props.onInfoClick(type, selectedOption.value);
            }}
          >
            &#x24d8;&nbsp;
          </span>
        }
        <span>{selectedOption.label}</span>
      </div>

    )
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
        <div className="Filters-row">
          <Select
            name="geography"
            onChange={this.handleChange("geography")}
            options={geographyOptions}
            placeholder="Geography"
            value={geography}
            valueRenderer={this.renderOptions("geography")}
          />

          <Select
            disabled={!geography}
            name="topic"
            onChange={this.handleChange("topic")}
            options={topicOptions}
            placeholder={geography ? "Topic" : "Please select geography"}
            value={topic}
            valueRenderer={this.renderOptions("topic")}
          />

          <Select
            disabled={!topic}
            name="indicator"
            onChange={this.handleChange("indicator")}
            options={indicatorOptions}
            placeholder={topic ? "Indicator" : "Please select topic"}
            value={indicator}
            valueRenderer={this.renderOptions("indicator")}
          />

          <Select
            disabled={yearOptions.length == 0}
            name="year"
            onChange={this.handleChange("year")}
            options={yearOptions}
            placeholder={indicator ? "Year" : "Please select Indicator"}
            value={year}
            valueRenderer={this.renderOptions("year")}
          />
        </div>

        <div className="Filters-row right">
          <span type="button" className="Filters-reset-filters" onClick={clearFilters} role="button">Clear All</span>
        </div>
      </div>
    );
  }

}
