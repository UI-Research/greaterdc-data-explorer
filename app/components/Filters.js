import { h, Component } from "preact";
import Select from "react-select";
import map from "lodash.map";
import classnames from "classnames";
import ClickOutside from "react-click-outside";

import { sortIndicators, hasNotesAndSources } from "../lib/data";

import { geographyOptions } from "../support/filters";

export default class Filters extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  state = {
    tooltipLevel: null,
    tooltipItem: null,
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  handleChange = (name) => (opt) => {
    this.props.setFilter(name, (opt && opt.value));

    if (name === "indicator" && opt && opt.value) {
      window.setTimeout(() => {
        const node = document.querySelector(`.data-table-row.${opt.value}`)
        if (node) {
          const scroller = document.querySelector(".DataTable .scroller");

          scroller.scrollTop = node.offsetTop;
        }
      }, 10);
    }
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setTooltip = (tooltipLevel, tooltipItem) => this.setState({ tooltipLevel, tooltipItem });

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
              ev.stopPropagation();
              ev.stopImmediatePropagation();

              if (this.state.tooltipLevel) {
                this.setTooltip(null, null);
              }
              else {
                this.setTooltip(type, selectedOption.value);
              }
            }}
          >
            &#x24d8;&nbsp;
          </span>
        }
        <span>{selectedOption.label}</span>
      </div>
    );
  }

  render() {
    const { tooltipLevel, tooltipItem } = this.state;
    const { filters, selectedFilters, clearFilters, metadata, notesAndSources } = this.props;
    const { geography, topic, indicator, year } = selectedFilters;

    if (!filters) return null;

    const tooltipCx = classnames("sources-and-notes-tooltip", tooltipLevel, tooltipItem, {
      visible: tooltipLevel !== null && tooltipItem !== null,
    });
    const tooltipContent = (notesAndSources.find(i => i.level === tooltipLevel && i.item === tooltipItem) || {}).text;

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
        <ClickOutside onClickOutside={() => this.setTooltip(null, null)}>
          <div
            className={tooltipCx}
            dangerouslySetInnerHTML={{__html: tooltipContent}}
          />
        </ClickOutside>

        <div className="Filters-row">
          <Select
            name="geography"
            onChange={this.handleChange("geography")}
            options={geographyOptions}
            placeholder="Geography"
            value={geography}
            valueRenderer={this.renderOptions("geography")}
            openOnClick={false}
          />

          <Select
            disabled={!geography}
            name="topic"
            onChange={this.handleChange("topic")}
            options={topicOptions}
            placeholder={geography ? "Topic" : "Please select geography"}
            value={topic}
            valueRenderer={this.renderOptions("topic")}
            openOnClick={false}
          />

          <Select
            disabled={!topic}
            name="indicator"
            onChange={this.handleChange("indicator")}
            options={sortIndicators(indicatorOptions, metadata)}
            placeholder={topic ? "Indicator" : "Please select topic"}
            value={indicator}
            valueRenderer={this.renderOptions("indicator")}
            openOnClick={false}
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
          <span className="Filters-reset-filters" onClick={clearFilters} role="button">Clear All</span>
        </div>
      </div>
    );
  }

}
