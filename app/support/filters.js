import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
  topics,
  geographies,
} from "../constants/taxonomy";

export const geographyOptions = Object.keys(geographies).map(key => ({ value: key, label: geographies[key] }));

const options = Object.keys(topics).map(key => ({ value: key, label: topics[key] }));

export const topicOptions = {
  [GEO_OPT_CENSUS]: options,
  [GEO_OPT_ANCS]: options,
  [GEO_OPT_PSAS]: options,
  [GEO_OPT_ZIP_CODES]: options,
};
