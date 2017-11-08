export const GEO_OPT_CENSUS = "census";
export const GEO_OPT_ZIP_CODES = "zip-codes";
export const GEO_OPT_ANCS = "ancs";
export const GEO_OPT_PSAS = "psas";

export const TOPIC_OPT_HEALTH = "health";
export const TOPIC_OPT_HOUSING = "housing";
export const TOPIC_OPT_IMMIGRATION = "immigration";
export const TOPIC_OPT_WEALTH = "wealth";
export const TOPIC_OPT_JOBS = "jobs";
export const TOPIC_OPT_POVERTY = "poverty";
export const TOPIC_OPT_AGING = "aging";
export const TOPIC_OPT_RACE = "race";
export const TOPIC_OPT_CHILDREN = "children";
export const TOPIC_OPT_CRIME = "crime";
export const TOPIC_OPT_EDUCATION = "education";
export const TOPIC_OPT_FAMILIES = "families";

const taxonomies = [
  { value: TOPIC_OPT_HEALTH, label: "Health and health policy" },
  { value: TOPIC_OPT_HOUSING, label: "Housing and housing finance" },
  { value: TOPIC_OPT_IMMIGRATION, label: "Immigrants and immigration" },
  { value: TOPIC_OPT_WEALTH, label: "Income and wealth" },
  { value: TOPIC_OPT_JOBS, label: "Job market and labor force" },
  { value: TOPIC_OPT_POVERTY, label: "Poverty, vulnerability , and the safety net" },
  { value: TOPIC_OPT_AGING, label: "Aging" },
  { value: TOPIC_OPT_RACE, label: "Race and ethnicity" },
  { value: TOPIC_OPT_CHILDREN, label: "Children" },
  { value: TOPIC_OPT_CRIME, label: "Crime and justice" },
  { value: TOPIC_OPT_EDUCATION, label: "Education and training" },
  { value: TOPIC_OPT_FAMILIES, label: "Families" },
];

const dcZipCodes = [
  20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010,
  20011, 20012, 20015, 20016, 20017, 20018, 20019, 20020, 20024, 20032,
  20036, 20037, 20052, 20057, 20059, 20064, 20332, 20336,
];

export const geographyOptions = [
  { value: GEO_OPT_CENSUS, label: "Census Tracts" },
  { value: GEO_OPT_ZIP_CODES, label: "Zip Codes" },
  { value: GEO_OPT_ANCS, label: "Advisory Neighboorhood Commissions (ANCs)" },
  { value: GEO_OPT_PSAS, label: "Police Service Areas (PSAs)" },
];

export const topicOptions = {
  [GEO_OPT_CENSUS]: taxonomies,
  [GEO_OPT_ANCS]: taxonomies,
  [GEO_OPT_PSAS]: taxonomies,
  [GEO_OPT_ZIP_CODES]: dcZipCodes.map(zip => ({ value: zip, label: zip })),
};

export const topicPlaceholders = {
  [GEO_OPT_CENSUS]: "Census Tract",
  [GEO_OPT_ANCS]: "Advisory Neighboorhood Commision (ANC)",
  [GEO_OPT_PSAS]: "Police Service Area (PSA)",
  [GEO_OPT_ZIP_CODES]: "Zip Code",
}

export const indicatorOptions = {
  [TOPIC_OPT_HEALTH]: [],
  [TOPIC_OPT_HOUSING]: [],
  [TOPIC_OPT_IMMIGRATION]: [],
  [TOPIC_OPT_WEALTH]: [],
  [TOPIC_OPT_JOBS]: [],
  [TOPIC_OPT_POVERTY]: [],
  [TOPIC_OPT_AGING]: [],
  [TOPIC_OPT_RACE]: [],
  [TOPIC_OPT_CHILDREN]: [],
  [TOPIC_OPT_CRIME]: [],
  [TOPIC_OPT_EDUCATION]: [],
  [TOPIC_OPT_FAMILIES]: [],
};

export const yearOptions = (geography, topic, indicator) => {
  return {
    [GEO_OPT_CENSUS]: [],
    [GEO_OPT_ZIP_CODES]: [],
    [GEO_OPT_ANCS]: [],
    [GEO_OPT_PSAS]: [],
  }[geography] || [];
}
