import axios from "axios";

import {
  equal,
} from "./classifiers";

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

export const fetchDataSource = (geography, topic) => {
  const url = `/data/${topic}/${topic}_${geography}.json`;
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
  const url = `/data/${topic}/${topic}_${geography}_metadata..json`
  return axios
    .get(url)
    .then(response => {
      if (response.headers["content-type"].match(/application\/json/)) {
        return response.data;
      }
      throw new Error(`Unable to fetch '${url}'`);
    });
}

const INDICATORS_BLACKLIST = [
  "start_date", "end_date", "timeframe",
  "Anc2012", "ANC2012_nf",
  "City", "CITY_nf",
  "Psa2012", "PSA2012_nf",
  "Geo2000", "GEO2000_nf",
  "Geo2010", "GEO2010_nf",
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

export const choroplethRows = (data, year = null) => {
  return year ? data.filter(r => r.timeframe === year) : data;
}

export const choroplethColor = (data, geography, indicator, year = null) => {
  const values = choroplethRows(data, year).map(row => row[indicator]);
  const steps = equal(values);

  return (row) => {
    const bucket = steps.findIndex(step => row[indicator] <= step);
    return bucket === -1 ? "rgba(0,0,0,0)" : blueColorRamp[bucket];
  };
};
