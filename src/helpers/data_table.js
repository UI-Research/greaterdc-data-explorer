import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
  GEO_OPT_WD12,
  GEO_OPT_COUNTY,
  GEO_OPT_CLUSTER,
} from "../constants/taxonomy.js";

import {
  rowKey
} from "../lib/data.js";

export const areaLabel = (geography, areaProps) => {
  if (!geography || !areaProps) {
    return `Please select ${!geography ? "a geography " : ""} ${!geography && !areaProps ? "and " : ""} ${!areaProps ? "an area" : ""}`;
  }

  switch (geography) {
  case GEO_OPT_CENSUS:
    return `Tract ${areaProps.TRACTCE.replace(/^0*/, "").match(/^(\d*)(\d{2})/).slice(1,3).join(".")}`;

    case GEO_OPT_ZIP_CODES:
      return `ZIP ${areaProps.ZIPCODE}`;

  case GEO_OPT_CLUSTER:
    return `${areaProps.NBH_NAMES}`;

  case GEO_OPT_ANCS:
  case GEO_OPT_WD12:
    return areaProps.NAME;

  case GEO_OPT_PSAS:
    return `PSA ${areaProps.NAME}`;

  case GEO_OPT_COUNTY:
    return areaProps.NAME;

  default:
    return null;
  }
};

export const headerLabels = {
  [GEO_OPT_CENSUS]: "Tract",
  [GEO_OPT_ZIP_CODES]: "Zip Code",
  [GEO_OPT_ANCS]: "ANC",
  [GEO_OPT_PSAS]: "PSA",
  [GEO_OPT_WD12]: "Ward",
  [GEO_OPT_CLUSTER]: "Neighborhood",
};

export const areaRows = (data, geography, area) => {
  if (!data || !area) return [];

  return data
  .filter(row => row[rowKey(geography)].toString() === area.toString());
}
