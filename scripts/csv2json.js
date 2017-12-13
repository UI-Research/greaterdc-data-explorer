const path = require("path");
const fs = require("fs");
const glob = require("glob");
const mkdirp = require("mkdirp");
const parse = require("csv-parse/lib/sync");

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

  const json = parse(fs.readFileSync(file), { columns: true, auto_parse: true, skip_empty_lines: true });
  fs.writeFileSync(json_path, JSON.stringify(json));
  console.log(`Converted ${file} to ${json_path}\n`);
}

// main script
const argv = require("minimist")(process.argv.slice(2));
const { from, to } = argv;

if (!from || !to) {
  console.log("\nMissing arguments");
  console.log("Usage: node scripts/csv2json.js --from=path/to/sources --to=path/to/destination\n");

  return;
}

try {
  if (!fs.lstatSync(from).isDirectory()) throw new Error();
}
catch(e) {
  console.log(`Invalid path '${from}'`)
  return;
}

glob(`${from.replace(/\/$/, "")}/**/*.csv`, (err, files) => {
  files.forEach(file => csv2json(file, from, to));
});
