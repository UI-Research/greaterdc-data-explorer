import { h, Component } from "preact";
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';

import {
  topics,
} from "../constants/taxonomy";

import {
  areaLabel,
  areaRows,
  headerLabels,
} from "../support/data_table";

import {
  indicators,
  years,
  aggregates,
  csvSourceURL,
  formatNumber,
  rowMOE,
} from "../lib/data";

export default class DataTable extends Component {

  render() {
    const { selectedFilters: { geography, topic, indicator, year }, area, areaProps, data, metadata } = this.props;

    const canShowData = !!(geography && topic);
    const geographyType = headerLabels[geography];

    const rows = [];
    indicators(data, metadata).forEach(({ value: currentIndicator, label }) => {
      const areaValues = areaRows(data, geography, area);

      const selectedYears = year ? [ { value: year } ] : years(data);

      selectedYears.forEach(({ value: currentYear }) => {
        const aggs = aggregates(data, currentIndicator, currentYear);
        const cx = currentIndicator === indicator ? "highlight" : ""

        const row = area && areaValues.length > 0
          ? areaValues.find(r => r.timeframe === currentYear)
          : {};

        const areaValue = row[currentIndicator] || "N/A";
        const marginOfError = rowMOE(row, currentIndicator);

        rows.push(
          <tr key={`${currentIndicator}-${currentYear}`} className={cx}>
            <td>{label}, {currentYear}</td>
            <td>
              <span>{area && formatNumber(areaValue)}</span>
              <span className="moe">{marginOfError && `±${marginOfError}`}</span>
            </td>
            <td>{formatNumber(aggs.avg)}</td>
            <td>{formatNumber(aggs.min)}</td>
            <td>{formatNumber(aggs.max)}</td>
          </tr>
        );
      });

      rows.push(
        <tr key={`${currentIndicator}-separator`}>
          <td colSpan="5" class="separator" />
        </tr>
      );
    });

    const downloadURL = csvSourceURL(geography, topic);
    const downloadName = downloadURL.match(/\/([\w\d_\-\.]+)$/)[1];

    return (
      <div className="container data-table-container">
        <div className="DataTable">
          <div className="scroller" ref={ref => this.scroller = ref}>
            <table>
              <thead>
                <tr>
                  <td>Indicator</td>
                  <td>{areaLabel(geography, areaProps)}</td>
                  <td className="text-center" colSpan="3">{geographyType ? `All ${geographyType}s` : "Please select a geography"}</td>
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
          <span className="button data-download-button" href={downloadURL} download={downloadName} role="button">Download Data</span>
        </div>
        <div class="tab-container">
          <Tabs defaultTab="about">
            <TabList>
              <Tab tabFor="about">About this App</Tab>
              <Tab tabFor="notes">Notes & Sources</Tab>
            </TabList>
            <TabPanel tabId="about">
              <h2>About this App</h2>
              <p>Looking for data about your community but don't know where to find it? Find data in our DC neighborhood profiles in the following subject areas: population, well-being, housing, foreclosures, and schools. Browse for relevant statistics and downloadable data.</p>
            </TabPanel>
            <TabPanel tabId="notes">
              <ol className="source-list">
                <li>Info about item 1</li>
                <li>Infor about item 2</li>
              </ol>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}
