import { h, Component } from "preact";
import PropTypes from "prop-types";
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
  hasNotesAndSources,
} from "../lib/data";

export default class DataTable extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  static propTypes = {
    selectedFilters: PropTypes.object.isRequired,
    area: PropTypes.string,
    areaProps: PropTypes.object,
    data: PropTypes.array,
    metadata: PropTypes.object,
    notesAndSources: PropTypes.shape({
      geography: PropTypes.string,
      topic: PropTypes.string,
      indicator: PropTypes.string,
    }),
    selectedTab: PropTypes.string.isRequired,
  }

  render() {
    const {
      selectedFilters: { geography, topic, indicator, year },
      area, areaProps, data, metadata, notesAndSources,
      selectedTab,
    } = this.props;

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

        const areaValue = row && row[currentIndicator] || "N/A";
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
    const downloadName = downloadURL.match(/\/([\w\d_\-.]+)$/)[1];

    return (
      <div className="container data-table-container">

        {!canShowData &&
          <div className="DataTable DataTable-empty">
            <img src="./images/empty-table.png" alt="No data to show" />
            <span>Explore Greater DC Area Data by &lsquo;Geography&rsquo;, &lsquo;Topic&rsquo;, &lsquo;Indicator&rsquo;, &amp; &lsquo;Year&rsquo;</span>
          </div>
        }

        {canShowData &&
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
                    <td>
                      {hasNotesAndSources(notesAndSources, "general", "average") &&
                        <span className="info-button" onClick={() => this.props.onInfoClick("general", "average")}>&#x24d8;&nbsp;</span>
                      }
                      Average
                    </td>
                    <td>
                      {hasNotesAndSources(notesAndSources, "general", "low") &&
                        <span className="info-button" onClick={() => this.props.onInfoClick("general", "low")}>&#x24d8;&nbsp;</span>
                      }
                      Low
                    </td>
                    <td>
                      {hasNotesAndSources(notesAndSources, "general", "high") &&
                        <span className="info-button" onClick={() => this.props.onInfoClick("general", "high")}>&#x24d8;&nbsp;</span>
                      }
                      High
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5" className="indicator">
                      {topics[topic] || "Please select a topic"}
                    </td>
                  </tr>

                  {rows}

                </tbody>
              </table>
            </div>
            <a className="button data-download-button" href={downloadURL} download={downloadName} role="button">Download Data</a>
          </div>
        }

        <div class="tab-container">
          <Tabs defaultTab={selectedTab} onChange={tab => this.props.setSelectedTab(tab)}>
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
                {notesAndSources.map(({ level, item, text }) => (
                  <li
                    key={`${level}-${item}`}
                    id={`${level}-${item}`}
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                ))}
              </ol>
            </TabPanel>
          </Tabs>
        </div>

      </div>
    );
  }
}
