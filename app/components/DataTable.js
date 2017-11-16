import { h, Component } from "preact";

import {
  geographies,
  topics,
} from "../constants/taxonomy";

import {
  areaLabel,
  areaRows,
} from "../support/data_table";

import {
  indicators,
  years,
  aggregates,
} from "../lib/data";

export default class DataList extends Component {

  render() {
    const { filters: { geography, topic, indicator, year }, area, areaProps, data, metadata } = this.props;

    const canShowData = !!(geography && topic);
    const geographyType = geographies[geography];

    const rows = [];
    indicators(data, metadata).forEach(({ value: currentIndicator, label }) => {
      const areaValues = areaRows(data, geography, area);

      const selectedYears = year ? [ { value: year } ] : years(data);

      selectedYears.forEach(({ value: currentYear }) => {
        const aggs = aggregates(data, currentIndicator, currentYear);
        const cx = currentIndicator === indicator ? "highlight" : ""

        const areaValue = area && areaValues.length > 0
        ? areaValues.find(r => r.timeframe === currentYear)[currentIndicator]
        : "N/A";

        rows.push(
          <tr key={`${currentIndicator}-${currentYear}`} className={cx}>
            <td>{label}, {currentYear}</td>
            <td>{area && areaValue}</td>
            <td>{aggs.avg}</td>
            <td>{aggs.min}</td>
            <td>{aggs.max}</td>
          </tr>
        );
      });

      rows.push(
        <tr key={`${currentIndicator}-separator`}>
          <td colSpan="5" class="separator" />
        </tr>
      );
    });

    return (
      <div className="DataTable">
        <div className="container">

          {canShowData &&
            <div class="DataTable-actions">
              <button>📄 Download Data</button>
              <a href="#">Sources and Notes</a>
            </div>
          }

          <table>
            <thead>
              <tr>
                <td>{areaLabel(geography, areaProps)}</td>
                <td>{area ? `This ${geographyType}` : "Please select an area"}</td>
                <td colSpan="3">{geographyType ? `All Tracts in DC` : "Please select a geography"}</td>
              </tr>
              <tr>
                <td colSpan="2" />
                <td>Average</td>
                <td>Low</td>
                <td>High</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="indicator">
                  {topics[topic] || "Please select a topic"}
                </td>
              </tr>

              {rows}

              {!canShowData &&
                <tr className="no-data">
                  <td colSpan="1" />
                  <td>No data to show</td>
                  <td colSpan="3" />
                </tr>
              }
            </tbody>
          </table>

        </div>
      </div>
    );
  }
}
