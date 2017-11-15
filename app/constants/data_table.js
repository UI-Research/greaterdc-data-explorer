import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
} from "./filters";

import {
  rowKeyFor,
} from "./map";

export const geographyLabel = (geography) => {
  return {
    [GEO_OPT_CENSUS]: "Tract",
    [GEO_OPT_ZIP_CODES]: "Zip Code" ,
    [GEO_OPT_ANCS]: "ANC",
    [GEO_OPT_PSAS]: "PSA",
  }[geography];
};

export const areaLabel = (geography, areaProps) => {
  if (!geography || !areaProps) {
    return `Please select ${!geography ? "a geography " : ""} ${!geography && !areaProps ? "and " : ""} ${!areaProps ? "an area" : ""}`;
  }

  return {
    [GEO_OPT_CENSUS]: `Tract ${areaProps.TRACT.replace(/^0*/, "").match(/^(\d*)(\d{2})/).slice(1,3).join(".")}`,
    [GEO_OPT_ZIP_CODES]: `ZIP ${areaProps.ZIPCODE}`,
    [GEO_OPT_ANCS]: areaProps.NAME,
    [GEO_OPT_PSAS]: `PSA ${areaProps.NAME}`,
  }[geography];
};

export const rowsFor = (data, geography, area) => {
  if (!data || !area) return [];

  const rowKey = rowKeyFor(geography);

  return data
  .filter(row => row[rowKey].toString() === area.toString());
}

const isNumeric = (n) => ( !isNaN(parseFloat(n)) && isFinite(n) );

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
