import axios from "axios";
import groupBy from "lodash.groupby";
import sortedUniq from "lodash.sorteduniq";

import {
  blueColorRamp,
} from "../constants/colors";

import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
  GEO_OPT_WD12,
  // GEO_OPT_CITY,
  // GEO_OPT_CLUSTER,
} from "../constants/taxonomy";

export const dataSourceKey = (geography, topic) => (
  `${geography}_${topic}`
);

export const rowKey = (geography) => ({
  [GEO_OPT_CENSUS]    : "geo2010_nf",
  [GEO_OPT_ZIP_CODES] : "zip_nf",
  [GEO_OPT_ANCS]      : "anc2012_nf",
  [GEO_OPT_PSAS]      : "psa2012_nf",
  [GEO_OPT_WD12]      : "ward2012_nf",
  // [GEO_OPT_CITY]      : "city_nf",
  // [GEO_OPT_CLUSTER]   : "cluster_tr2000_nf",
}[geography]);

//
// Data fetching
//
export const fetchDataSource = (geography, topic) => {
  const url = `./data/${topic}/${topic}_${geography}.json`;
  return axios
  .get(url)
  .then(response => {
    if (response.headers["content-type"].match(/application\/json/)) {
      return response.data;
    }
    throw new Error(`Unable to fetch '${url}'`);
  });
};

export const fetchMetadataSource = (geography, topic) => {
  const url = `./data/${topic}/${topic}_${geography}_metadata.json`
  return axios
  .get(url)
  .then(response => {
    if (response.headers["content-type"].match(/application\/json/)) {
      return response.data;
    }
    throw new Error(`Unable to fetch '${url}'`);
  });
}

export const fetchFilters = () => {
  return axios
  .get("./data/filters.json")
  .then(response => {
    if (response.headers["content-type"].match(/application\/json/)) {
      return response.data;
    }
    throw new Error("Unable to fetch ./data/filters.json");
  });
}

export const fetchHelpText = () => {
  return axios
  .get("./data/help-text.json")
  .then(response => {
    if (response.headers["content-type"].match(/application\/json/)) {
      return response.data;
    }
    throw new Error("Unable to fetch ./data/help-text.json");
  });
}

//
// Filters
//
const INDICATORS_BLACKLIST = [
  "start_date", "end_date", "timeframe", "indc",
  "Anc2012", "City", "Psa2012", "Geo2000", "Geo2010", "Ward2012", "Zip",
];

export const indicatorLabel = (indicator, metadata) => metadata.find(e => e.NAME === indicator).LABEL;

export const filterColumn = (column) => {
  if (/(_m|_moe|_nf)$/i.test(column)) return false;

  return !INDICATORS_BLACKLIST.includes(column);
}

export const indicators = (data, metadata) => {
  if (!data || !metadata) return [];

  return Object.keys(data[0])
    .filter(filterColumn)
    .reduce((all, indicator) => [ ...all, { value: indicator, label: indicatorLabel(indicator, metadata) }], []);
};

export const years = (data) => {
  if (!data) return [];

  // return data
  return sortedUniq(data.map(row => row.timeframe).sort())
    .reduce((all, year) => [ ...all, { label: year, value: year } ], []);
};

//
// Data table
//
export const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

export const aggregates = (data, indicator, year) => {
  if (!data || !indicator || !year) return {};

  const values = data
  .filter(row => row.timeframe === year && isNumeric(row[indicator]))
  .map(row => row[indicator])

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: (values.reduce((total, val) => total + val, 0) / values.length).toFixed(2),
  };
}

export const csvSourceURL = (geography, topic) => `/data/${topic}/${topic}_${geography}.csv`;

//
// Choropleth
//
const areaTransform = (geography, value) => ({
  [GEO_OPT_CENSUS]: v => v.toString(),
  [GEO_OPT_ZIP_CODES]: v => parseInt(v, 10),
  [GEO_OPT_ANCS]: v => v.toString(),
  [GEO_OPT_PSAS]: v => v.toString(),
  [GEO_OPT_WD12]: v => parseInt(v, 10),
}[geography](value));

export const rowMOE = (row, indicator) => {
  const moe = row[`${indicator}_m`] || row[`${indicator}_MOE`];

  return isNumeric(moe) ? moe : null;
}

export const choroplethRows = (data, geography, indicator, year = null) => {
  if (year) {
    return data
      .filter(row => row.timeframe === year && isNumeric(row[indicator]))
      .map(row => ({
        [rowKey(geography)]: areaTransform(geography, row[rowKey(geography)]),
        [indicator]: row[indicator],
        moe: row[`${indicator}_m`] || row[`${indicator}_MOE`],
      }));
  }

  const cleanData = data.filter(row => isNumeric(row[indicator]));
  const grouped = groupBy(cleanData, rowKey(geography));

  const aggregateRows = Object.keys(grouped).map(area => ({
    [rowKey(geography)]: areaTransform(geography, area),
    [indicator]: grouped[area].reduce((sum, row) => sum + row[indicator], 0) / grouped[area].length,
    moe: null,
  }));

  return aggregateRows;
}

export const choroplethColorStops = (rows, steps, geography, indicator) => {
  return rows.map(row => {
    const bucket = steps.findIndex(step => row[indicator] <= step);
    const color = bucket === -1 ? "rgba(255,255,255,0)" : blueColorRamp[bucket];

    const stop = [ row[rowKey(geography)], color ];
    return stop;
  });
}

//
// Map legend
//
export const areaValue = (rows, area, geography, indicator, year) => {
  if (!year || !area) return "Select Year";

  const value = rows.find(r => r.timeframe === year && r[rowKey(geography)].toString() === area.toString())[indicator];

  return formatNumber(value);
}

//
// Sources & Notes
//
// export const notesAndSourcesFor = (data, selectedFilters) => {
//   if (!data) return {};
export const hasNotesAndSources = (data, level, item) => {
  if (!data) return false;

  return data.find(h => h.level === level && h.item === item);
}

//
// Value formatting
//
export const formatNumber = (value) => {
  // truncate to 2 decimal places to check if number is integer
  //
  // Number.isInteger(1000.00) => true
  // Number.isInteger(1000.001) => false
  const truncated = parseFloat(value.toString().replace(/(\.\d{2})\d+$/, "$1"));

  return Number.isInteger(truncated) ? parseInt(value) : parseFloat(value).toFixed(2)
};
