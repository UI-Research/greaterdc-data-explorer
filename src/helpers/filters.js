import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
  GEO_OPT_CLUSTER,
  topics,
  geographies,
} from "../constants/taxonomy.js";

import { INDICATORS_BLACKLIST } from "../constants/filters.js";

export const geographyOptions = Object.keys(geographies).map(key => ({ value: key, label: geographies[key] }));

const options = Object.keys(topics).map(key => ({ value: key, label: topics[key] }));

export const topicOptions = {
  [GEO_OPT_CENSUS]: options,
  [GEO_OPT_ANCS]: options,
  [GEO_OPT_PSAS]: options,
  [GEO_OPT_ZIP_CODES]: options,
  [GEO_OPT_CLUSTER]: options,
};

export const filterColumn = (column) => {
  if (/(_m|_moe|_nf)$/i.test(column)) return false;

  return !INDICATORS_BLACKLIST.includes(column);
}
