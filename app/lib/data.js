import axios from "axios";
import groupBy from "lodash.groupby";

import {
  blueColorRamp,
} from "../constants/colors";

import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
} from "../constants/taxonomy";

export const dataSourceKey = (geography, topic) => (
  `${geography}_${topic}`
);

export const rowKey = (geography) => ({
  [GEO_OPT_CENSUS]: "GEO2010_nf",
  [GEO_OPT_ZIP_CODES]: null,
  [GEO_OPT_ANCS]: "ANC2012_nf",
  [GEO_OPT_PSAS]: "PSA2012_nf",
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
  const url = `./data/${topic}/${topic}_${geography}_metadata..json`
  return axios
    .get(url)
    .then(response => {
      if (response.headers["content-type"].match(/application\/json/)) {
        return response.data;
      }
      throw new Error(`Unable to fetch '${url}'`);
    });
}

//
// Filters
//
const INDICATORS_BLACKLIST = [
  "start_date", "end_date", "timeframe", "indc",
  "Anc2012", "ANC2012_nf",
  "City", "CITY_nf",
  "Psa2012", "PSA2012_nf",
  "Geo2000", "GEO2000_nf",
  "Geo2010", "GEO2010_nf", "geo2010_nf",
  "Ward2002", "WARD2002_nf",
];

export const indicatorLabel = (indicator, metadata) => metadata.find(e => e.NAME === indicator).LABEL;

export const indicators = (data, metadata) => {
  if (!data || !metadata) return [];

  return Object.keys(data[0])
    .filter(column => !INDICATORS_BLACKLIST.includes(column))
    .reduce((all, indicator) => [ ...all, { value: indicator, label: indicatorLabel(indicator, metadata) }], []);
};

const uniq = (value, index, self) => (self.indexOf(value) === index);

export const years = (data) => {
  if (!data) return [];

  return data
    .map(row => row.timeframe)
    .filter(uniq)
    .sort()
    .reduce((all, year) => [ ...all, { label: year, value: year } ], []);
};

//
// Data table
//
const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

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
export const choroplethRows = (data, geography, indicator, year = null) => {
  if (year) {
    return data.filter(row => row.timeframe === year && isNumeric(row[indicator]));
  }

  const cleanData = data.filter(row => isNumeric(row[indicator]));
  const grouped = groupBy(cleanData, rowKey(geography));
  const aggregateRows = Object.keys(grouped).map(area => ({
    [rowKey(geography)]: area,
    [indicator]: grouped[area].reduce((sum, row) => sum + row[indicator], 0) / grouped[area].length,
  }))

  return aggregateRows;
}

export const choroplethColorStops = (rows, steps, geography, indicator) => {
  return rows.map(row => {
    const bucket = steps.findIndex(step => row[indicator] <= step);
    const color = bucket === -1 ? "rgba(255,255,255,0)" : blueColorRamp[bucket];

    const stop = [ row[rowKey(geography)].toString(), color ];
    return stop;
  });
}
