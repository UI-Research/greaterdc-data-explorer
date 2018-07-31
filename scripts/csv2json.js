/* eslint-disable no-console */

import path from "path";
import fs from "fs";
import glob from "glob";
import mkdirp from "mkdirp";
import parse from "csv-parse/lib/sync";

const geographiesKeys = [
  "geo2010_nf",
  "zip_nf",
  "anc2012_nf",
  "psa2012_nf",
  "ward2012_nf",
  "county_nf",
  "cluster_tr2000_nf",
];

// downcase all geography column names to ensure consistency
function transformColumns(columns) {
  return columns.map(column => (
    geographiesKeys.includes(column.toLowerCase())
      ? column.toLowerCase()
      : column
  ));
}

function csv2json(file, from, to) {
  const destination_path = path.join(...[
    process.cwd(),
    to,
    path.dirname(file).replace(from, ""),
  ]);

  const json_path = path.join(destination_path, `${path.basename(file, ".csv")}.json`).toLowerCase();
  const csv_path = path.join(destination_path, path.basename(file)).toLowerCase();

  mkdirp.sync(destination_path);

  console.log(`Processing ${file}:`);

  fs.createReadStream(file).pipe(fs.createWriteStream(csv_path));
  console.log(`Copied ${file} to ${csv_path}`);

  const json =
    parse(fs.readFileSync(file), { columns: transformColumns, auto_parse: true, skip_empty_lines: true })
    .map(row => {
      const overrides = {};

      if (row.timeframe) overrides.timeframe = row.timeframe.toString();

      return { ...row, ...overrides };
    });

  fs.writeFileSync(json_path, JSON.stringify(json));
  console.log(`Converted ${file} to ${json_path}\n`);
}

//-----------------------------------------------------------------------------
// Main script

const argv = require("minimist")(process.argv.slice(2));
const { from, to } = argv;

if (!from || !to) {
  console.log("\nMissing arguments");
  console.log("Usage: node scripts/csv2json.js --from=path/to/sources --to=path/to/destination\n");

  process.exit(1);
}

try {
  if (!fs.lstatSync(from).isDirectory()) throw new Error();
}
catch(e) {
  console.log(`Invalid path '${from}'`)

  process.exit(1);
}

glob(`${from.replace(/\/$/, "")}/**/*.csv`, (err, files) => {
  files.forEach(file => csv2json(file, from, to));
});
