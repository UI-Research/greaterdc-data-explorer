export const GEO_OPT_CENSUS = "tr10";
export const GEO_OPT_ZIP_CODES = "zip";
export const GEO_OPT_ANCS = "anc12";
export const GEO_OPT_PSAS = "psa12";

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
  // { value: TOPIC_OPT_HEALTH, label: "Health and health policy" },
  // { value: TOPIC_OPT_HOUSING, label: "Housing and housing finance" },
  // { value: TOPIC_OPT_IMMIGRATION, label: "Immigrants and immigration" },
  // { value: TOPIC_OPT_WEALTH, label: "Income and wealth" },
  // { value: TOPIC_OPT_JOBS, label: "Job market and labor force" },
  // { value: TOPIC_OPT_POVERTY, label: "Poverty, vulnerability , and the safety net" },
  // { value: TOPIC_OPT_AGING, label: "Aging" },
  // { value: TOPIC_OPT_RACE, label: "Race and ethnicity" },
  // { value: TOPIC_OPT_CHILDREN, label: "Children" },
  { value: TOPIC_OPT_CRIME, label: "Crime and justice" },
  // { value: TOPIC_OPT_EDUCATION, label: "Education and training" },
  // { value: TOPIC_OPT_FAMILIES, label: "Families" },
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
  [GEO_OPT_ZIP_CODES]: taxonomies,
};
