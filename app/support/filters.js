import {
  GEO_OPT_CENSUS,
  GEO_OPT_ZIP_CODES,
  GEO_OPT_ANCS,
  GEO_OPT_PSAS,
  topics,
} from "../constants/taxonomy";

export const geographyOptions = [
  { value: GEO_OPT_CENSUS, label: "Census Tracts" },
  { value: GEO_OPT_ZIP_CODES, label: "Zip Codes" },
  { value: GEO_OPT_ANCS, label: "Advisory Neighboorhood Commissions (ANCs)" },
  { value: GEO_OPT_PSAS, label: "Police Service Areas (PSAs)" },
];

const options = Object.keys(topics).map(key => ({ value: key, label: topics[key] }));

export const topicOptions = {
  [GEO_OPT_CENSUS]: options,
  [GEO_OPT_ANCS]: options,
  [GEO_OPT_PSAS]: options,
  [GEO_OPT_ZIP_CODES]: options,
};
