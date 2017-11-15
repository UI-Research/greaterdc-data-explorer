import axios from "axios";

const INDICATORS_BLACKLIST = [
  "start_date", "end_date", "timeframe",
  "Anc2012", "ANC2012_nf",
  "City", "CITY_nf",
  "Psa2012", "PSA2012_nf",
  "Geo2000", "GEO2000_nf",
  "Geo2010", "GEO2010_nf",
  "Ward2002", "WARD2002_nf",
];

export const dataSourceKey = (geography, topic) => (
  `${geography}_${topic}`
);

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

const labelFor = (col, metadata) => metadata.find(e => e.NAME === col).LABEL;
export const indicators = (data, metadata) => {
  if (!data || !metadata) return [];


  return Object.keys(data[0])
    .filter(column => !INDICATORS_BLACKLIST.includes(column))
    .reduce((all, indicator) => [ ...all, { value: indicator, label: labelFor(indicator, metadata) }], []);
};


function uniq(value, index, self) {
  return self.indexOf(value) === index;
}

export const years = (data, year) => {
  if (!data) return [];

  return data
    .map(row => row.timeframe)
    .filter(uniq)
    .sort()
    .reduce((all, year) => [ ...all, { label: year, value: year } ], []);
};
