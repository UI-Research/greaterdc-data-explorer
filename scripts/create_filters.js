/* eslint-disable no-console */

/*
 * filters structure
 *
 * {
 *   [geography]: {
 *     value: String (=== geography),
 *     label: String,
 *     topics: {
 *       [topic]: {
 *         value: String (=== topic),
 *         label: String,
 *         indicators: {
 *           [indicator]: {
 *             value: String (=== indicator),
 *             label: String,
 *             years: [
 *               value: String,
 *               label: String,
 *             ]
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * */

import path from "path";
import fs from "fs";
import glob from "glob";
// import mkdirp from "mkdirp";
import parse from "csv-parse/lib/sync";

import { geographies, topics } from "../app/constants/taxonomy.js";
import { filterColumn, isNumeric } from "../app/lib/data";

function createFilters(from, to) {
  const filters = Object.keys(geographies).reduce((all, geography) => (
    {
      ...all,
      [geography]: {
        value: geography,
        label: geographies[geography],
        topics: getTopics(from).reduce((all, topic) => ({
          ...all,
          [topic]: {
            value: topic,
            label: topics[topic],
            indicators: indicatorsFor(geography, topic),
          }
        }), {}),
      }
    }
  ), {});

  const jsonPath = path.join(...[
    process.cwd(),
    to,
    "filters.json",
  ]);

  fs.writeFileSync(jsonPath, JSON.stringify(filters));

  return filters;
}

function getTopics(from) {
  return glob
  .sync(`${from}/*`)
  .filter(dir => fs.lstatSync(dir).isDirectory())
  .map(dir => {
    const components = dir.split("/");
    return components[components.length - 1];
  });
}

function indicatorsFor(geography, topic) {
  const metadataFilePath = `${from}/${topic}/${topic}_${geography}_metadata.csv`;

  const indicators =
  parse(fs.readFileSync(metadataFilePath), {
    columns: true,
    auto_parse: true,
    skip_empty_lines: true,
  })
  // .filter(line => !INDICATORS_BLACKLIST.includes(line.NAME))
  .filter(line => filterColumn(line.NAME))
  .map(line => ({
    value: line.NAME,
    label: line.LABEL,
    years: yearsFor(geography, topic, line.NAME),
  }))
  .reduce((all, indicator) => ({ ...all, [indicator.value]: indicator }), {});

  return indicators;
}

function yearsFor(geography, topic, indicator) {
  const dataFilePath = `${from}/${topic}/${topic}_${geography}.csv`

  let years =
  parse(fs.readFileSync(dataFilePath), {
    columns: true,
    auto_parse: true,
    skip_empty_lines: true,
  })
  .filter(line => isNumeric(line[indicator]))
  .map(line => line.timeframe)
  .filter((v, i, a) => a.indexOf(v) === i) // unique values filtering, https://stackoverflow.com/questions/1960473/get-all-unique-values-in-an-array-remove-duplicates
  .map(timeframe => ({ value: timeframe.toString(), label: timeframe.toString() }));

  return years;
}

//-----------------------------------------------------------------------------
// Main script

const argv = require("minimist")(process.argv.slice(2));
let { from, to } = argv;

// remove trailing slashes from `from`/`to` args
from = from.replace(/\/$/, "")
to = to.replace(/\/$/, "")

if (!from || !to) {
  console.log("\nMissing arguments");
  console.log("Usage: node scripts/create_filters.js --from=path/to/sources --to=path/to/destination\n");

  process.exit(1);
}

try {
  if (!fs.lstatSync(from).isDirectory()) throw new Error();
}
catch(e) {
  console.log(`Invalid path '${from}'`)
  process.exit(1);
}

console.log("Creating filters...");
createFilters(from, to);
console.log("Created filters");
