import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
} from "../constants/taxonomy";

export const shapefile = (geography) => {
  return {
    [GEO_OPT_CENSUS]: "mapbox://urbaninstitute.dm691mz1",
    [GEO_OPT_ZIP_CODES]: "mapbox://urbaninstitute.dvi7r97h",
    [GEO_OPT_ANCS]: "mapbox://urbaninstitute.41px4aw0",
    [GEO_OPT_PSAS]: "mapbox://urbaninstitute.7aqnlau8",
  }[geography];
};

export const sourceLayer = (geography) => {
  return {
    [GEO_OPT_CENSUS]: "census-2010-d2vbqp",
    [GEO_OPT_ZIP_CODES]: "zip-codes-5t51e9",
    [GEO_OPT_ANCS]: "ANC12-bac55n",
    [GEO_OPT_PSAS]: "PSA12-8baxgw",
  }[geography];
};

export const areaKey = (geography) => {
  return {
    [GEO_OPT_CENSUS]: "GEOID",
    [GEO_OPT_ZIP_CODES]: "GIS_ID",
    [GEO_OPT_ANCS]: "ANC_ID",
    [GEO_OPT_PSAS]: "NAME",
  }[geography];
}
