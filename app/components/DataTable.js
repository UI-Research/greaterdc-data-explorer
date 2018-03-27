import { h, Component } from "preact";
import PropTypes from "prop-types";
import classnames from "classnames";

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

  componentDidUpdate() {
    const { selectedFilters: { indicator } } = this.props;

    const node = document.querySelector(`.DataTable tbody tr.data-table-row.${indicator}`);
    const scroller = document.querySelector(".DataTable .scroller");

    if (node && scroller) scroller.scrollTop = node.offsetTop - 45;
  }

  render() {
    const {
      selectedFilters: { geography, topic, indicator, year },
      area, areaProps, data, metadata, notesAndSources,
    } = this.props;

    const canShowData = !!(geography && topic);
    const geographyType = headerLabels[geography];

    const rows = [];
    indicators(data, metadata).forEach(({ value: currentIndicator, label }) => {
      const areaValues = areaRows(data, geography, area);

      const selectedYears = year ? [ { value: year } ] : years(data);

      selectedYears.forEach(({ value: currentYear }) => {
        const aggs = aggregates(data, currentIndicator, currentYear);
        const cx = classnames("data-table-row", currentIndicator, {
          highlight: currentIndicator === indicator,
        });

        const row = area && areaValues.length > 0
          ? areaValues.find(r => r.timeframe === currentYear)
          : {};

          console.log("areaValues = " && areaValues);

        // need to show '0' values so removed the 'NA' assignment
        //const areaValue = row && row[currentIndicator] || "N/A";
        const areaValue = row && row[currentIndicator];

        const marginOfError = rowMOE(row, currentIndicator);


          if(areaValue !== "N/A" && areaValue !== "." && areaValue !== "X") {
            console.log("rows = " && rows);
          rows.push(
            <tr key={`${currentIndicator}-${currentYear}`} className={cx}>
              <td className="title">{label}, {currentYear}</td>
              <td>
                <span>{area && formatNumber(areaValue)}</span>
                <span className="moe">{marginOfError && `±${marginOfError}`}</span>
              </td>
              <td>{formatNumber(aggs.avg)}</td>
              <td className="hide-for-mobile">{formatNumber(aggs.min)}</td>
              <td className="hide-for-mobile">{formatNumber(aggs.max)}</td>
            </tr>
          );
        }
      });

      rows.push(
        <tr className="separator" key={`${currentIndicator}-separator`}>
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
            <span>Data you can trust about Greater DC communities.</span>
          </div>
        }

        {canShowData &&
          <div className="DataTable">
            <div className="scroller" ref={ref => this.scroller = ref}>
              <table>
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>{areaLabel(geography, areaProps)}</th>
                    <th className="text-center" colSpan="3">{geographyType ? `All ${geographyType}s` : "Please select a geography"}</th>
                  </tr>
                  <tr>
                    <th colSpan="2" />
                    <th>
                      {hasNotesAndSources(notesAndSources, "general", "average") &&
                        <span className="info-button" onClick={() => this.props.onInfoClick("general", "average")}>&#x24d8;&nbsp;</span>
                      }
                      Average
                    </th>
                    <th className="hide-for-mobile">
                      {hasNotesAndSources(notesAndSources, "general", "low") &&
                        <span className="info-button" onClick={() => this.props.onInfoClick("general", "low")}>&#x24d8;&nbsp;</span>
                      }
                      Low
                    </th>
                    <th className="hide-for-mobile">
                      {hasNotesAndSources(notesAndSources, "general", "high") &&
                        <span className="info-button" onClick={() => this.props.onInfoClick("general", "high")}>&#x24d8;&nbsp;</span>
                      }
                      High
                    </th>
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
      </div>
    );
  }
}
