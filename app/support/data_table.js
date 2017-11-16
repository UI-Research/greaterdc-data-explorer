import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
} from "../constants/taxonomy";

export const areaLabel = (geography, areaProps) => {
  if (!geography || !areaProps) {
    return `Please select ${!geography ? "a geography " : ""} ${!geography && !areaProps ? "and " : ""} ${!areaProps ? "an area" : ""}`;
  }

  switch (geography) {
  case GEO_OPT_CENSUS:
    return `Tract ${areaProps.TRACT.replace(/^0*/, "").match(/^(\d*)(\d{2})/).slice(1,3).join(".")}`;

  case GEO_OPT_ZIP_CODES:
    return `ZIP ${areaProps.ZIPCODE}`;

  case GEO_OPT_ANCS:
    return areaProps.NAME;

  case GEO_OPT_PSAS:
    return `PSA ${areaProps.NAME}`;

  default:
    return null;
  }
};

const rowKeys = {
  [GEO_OPT_CENSUS]: "GEO2010_nf",
  [GEO_OPT_ZIP_CODES]: null,
  [GEO_OPT_ANCS]: "ANC2012_nf",
  [GEO_OPT_PSAS]: "PSA2012_nf",
};

export const areaRows = (data, geography, area) => {
  if (!data || !area) return [];

  const rowKey = rowKeys[geography];

  return data
  .filter(row => row[rowKey].toString() === area.toString());
}
