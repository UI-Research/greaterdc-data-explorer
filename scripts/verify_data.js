/* eslint-disable no-console */

import fs from "fs";
import glob from "glob";
import isEqual from "lodash.isequal";
import minimist from 'minimist'
import parse from "csv-parse/lib/sync.js";
import sortedUniq from "lodash.sorteduniq";

const INDICATORS_BLACKLIST = [
  "start_date", "end_date", "timeframe", "indc",
  "Anc2012", "City", "Psa2012", "Geo2000", "Geo2010", "Ward2012", "Zip", "Cluster_tr2000",
];

const filterColumn = (column) => {
  if (/(_m|_moe|_nf)$/i.test(column)) return false;

  return !INDICATORS_BLACKLIST.includes(column);
}


function gatherData(from) {
  return glob
  .sync(`${from}/**/*metadata.csv`)
  .map(path => {
    const [ _dot, _data, topic, filename ] = path.split("/");
    const [ _t, geography, _m ] = filename.split("_");

    const indicators = parse(fs.readFileSync(path), {
      columns: true, auto_parse: true, skip_empty_lines: true
    })
    .filter(line => filterColumn(line.NAME))
    .map(line => line.NAME);

    return {
      geography,
      topic,
      indicators,
    };
  })
}

function verifyData(from) {
  const data = gatherData(from);
  const issues = [];

  // check for empty indicators
  data.forEach(({ geography, topic, indicators }) => {
    if (indicators.length === 0) {
      issues.push(`Empty indicators for ${geography}/${topic}`);
    }
  });

  // check for duplicate indicators in different topics
  const topics = sortedUniq(data.map(r => r.topic).sort());
  const topicIndicators = topics.map(topic => ({
    topic,
    indicators: data.find(r => r.topic === topic).indicators.sort(),
  }));

  topicIndicators.forEach(({ topic, indicators }) => {
    topics.forEach(innerTopic => {
      if (innerTopic !== topic && isEqual(indicators, topicIndicators.find(r => r.topic === innerTopic).indicators)) {
        issues.push(`Equal indicators for ${topic} and ${innerTopic} found`);
      }
    });
  });

  return issues;
}

//-----------------------------------------------------------------------------
// Main script

const argv = minimist(process.argv.slice(2));
let { from } = argv;

if (!from) {
  console.log("\nMissing arguments");
  console.log("Usage: node scripts/verify_data.js --from=path/to/sources");

  process.exit(1);
}

// remove trailing slashes from `from`/`to` args
from = from.replace(/\/$/, "")

try {
  if (!fs.lstatSync(from).isDirectory()) throw new Error();
}
catch(e) {
  console.log(`Invalid path '${from}'`)
  process.exit(1);
}

console.log("Verifying data...");

const issues = verifyData(from);
if (issues.length > 0) {
  console.log("\n⚠️  Issues detected in data:\n");
  issues.map(issue => console.log(`* ${issue}`));
  console.log("");
  process.exit(1);
}

console.log("Data OK!\n");
process.exit(0);
