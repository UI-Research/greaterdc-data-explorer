/* eslint-disable no-console */

import fs from "fs";
import mkdirp from "mkdirp";
import path from "path";

function generateHelpTextTemplate() {
  const file = fs.readFileSync(path.resolve(__dirname, "../", "public", "data", "filters.json"))
  const json = JSON.parse(file);

  const csv = [
    [ "level", "item", "text" ],
    [ "general", "average", "" ],
    [ "general", "low", "" ],
    [ "general", "high", "" ],
  ];

  // geographies
  Object.keys(json).forEach(geography => {
    csv.push([ "geography", geography, "" ]);

    Object.keys(json[geography].topics).forEach(topic => {
      csv.push([ "topic", topic, "" ]);

      Object.keys(json[geography].topics[topic].indicators).forEach(indicator => {
        csv.push([ "indicator", indicator, "" ]);
      });
    });
  });

  return csv.map(row => row.join(",")).join("\n") + "\n";
}

//-----------------------------------------------------------------------------
// Main script

const csv = generateHelpTextTemplate();
mkdirp.sync(path.resolve(__dirname, "../", "templates"));
fs.writeFileSync(path.resolve(__dirname, "../", "templates", "help-text.csv"), csv);

console.log("Template written to /templates/help-text.csv")
