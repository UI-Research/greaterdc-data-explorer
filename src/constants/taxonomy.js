export const GEO_OPT_CENSUS    = "tr10";
export const GEO_OPT_ZIP_CODES = "zip";
export const GEO_OPT_ANCS      = "anc12";
export const GEO_OPT_PSAS      = "psa12";
export const GEO_OPT_WD12      = "wd12";
export const GEO_OPT_COUNTY    = "cnty";
export const GEO_OPT_CLUSTER   = "cl17";

export const GEO_LABEL_CENSUS    = "Census Tracts";
export const GEO_LABEL_ZIP_CODES = "DC Zip Codes";
export const GEO_LABEL_ANCS      = "DC Advisory Neighboorhood Commissions";
export const GEO_LABEL_PSAS      = "DC Police Service Areas";
export const GEO_LABEL_WD12      = "DC Wards";
export const GEO_LABEL_COUNTY    = "Counties";
export const GEO_LABEL_CLUSTER   = "DC Neighborhood Clusters";

export const geographies = {
  [GEO_OPT_CENSUS]    : GEO_LABEL_CENSUS,
  [GEO_OPT_COUNTY]    : GEO_LABEL_COUNTY,
  [GEO_OPT_ANCS]      : GEO_LABEL_ANCS,
  [GEO_OPT_CLUSTER]   : GEO_LABEL_CLUSTER,
  [GEO_OPT_PSAS]      : GEO_LABEL_PSAS,
  [GEO_OPT_WD12]      : GEO_LABEL_WD12,
  [GEO_OPT_ZIP_CODES] : GEO_LABEL_ZIP_CODES,
}

export const TOPIC_OPT_POPULATION = "population";
export const TOPIC_OPT_HOUSING    = "housing";
export const TOPIC_OPT_INCOME     = "income";
export const TOPIC_OPT_EDUCATION  = "education";
export const TOPIC_OPT_HEALTH     = "health";
export const TOPIC_OPT_SAFETY     = "safety";
export const TOPIC_OPT_EMPLOYMENT = "employment";
export const TOPIC_OPT_CONNECTION = "connection";

export const TOPIC_LABEL_POPULATION = "Population";
export const TOPIC_LABEL_HOUSING    = "Housing";
export const TOPIC_LABEL_INCOME     = "Income";
export const TOPIC_LABEL_EDUCATION  = "Education";
export const TOPIC_LABEL_HEALTH     = "Health";
export const TOPIC_LABEL_SAFETY     = "Safety";
export const TOPIC_LABEL_EMPLOYMENT = "Employment";
export const TOPIC_LABEL_CONNECTION = "Connection";

export const topics = {
  [TOPIC_OPT_POPULATION] : TOPIC_LABEL_POPULATION,
  [TOPIC_OPT_HOUSING]    : TOPIC_LABEL_HOUSING,
  [TOPIC_OPT_INCOME]     : TOPIC_LABEL_INCOME,
  [TOPIC_OPT_EDUCATION]  : TOPIC_LABEL_EDUCATION,
  [TOPIC_OPT_HEALTH]     : TOPIC_LABEL_HEALTH,
  [TOPIC_OPT_SAFETY]     : TOPIC_LABEL_SAFETY,
  [TOPIC_OPT_EMPLOYMENT] : TOPIC_LABEL_EMPLOYMENT,
  [TOPIC_OPT_CONNECTION] : TOPIC_LABEL_CONNECTION,
}
