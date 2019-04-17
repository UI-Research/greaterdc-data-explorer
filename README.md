Greater DC Data Explorer
========================

Setup
---

#### Dev requirements:
    * `node >= v8.6.0`

#### Run:
  * `yarn start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
  * `yarn start-skip-verify`: same as `yarn start`, but skips data verification (which halts execution if any issues are found)
  * `yarn build` — builds minified project for production
  * `yarn build-skip-verify`: same as `yarn build`, but skips data verification (which halts execution if any issues are found)

#### Learn:
  * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
  * Place static files you want to be copied from `app/assets/` to `public/`.

Data Verification
---

#### Run
  * `yarn verify-data` - checks metadata files for empty indicators, and duplicate indicators for different topics.

#### Learn
  * `yarn start` / `yarn build` will automatically perform data verification before everything else; if data verification fails, the whole process will halt.
  * `yarn start-skip-verify` / `yarn build-skip-verify` will skip data verification. WARNING: This might lead to unexpected behaviour when running the application.


CSV Conversion
---

#### Run
  * `yarn convert-data` - converts all `.csv` files under `/data` to their `JSON` counterparts; converted files are placed in `app/assets/data/`, with the same folder structure as the original `/data` folder; original files will be copied to the destination folder to allow downloading

#### Learn
  * Place all csv files for conversion in the folder `/data` (create if not present), with 1 folder per topic (`/data/crime`, `/data/population`, ...)
     * All files and folder should be in lowercase
  * Folders and files MUST follow this structure:
     * `<topic>/<topic>_<geography>.csv`
     * `<topic>/<topic>_<geography>.metadata`
  * A CSV file with notes & sources must be placed at the root of the `/data` folder, and be named `help-text.csv`

Example `/data` folder structure:

```
data
├── help-text.csv
├── crime
│   ├── crime_anc12.csv
│   ├── crime_anc12_metadata.csv
│   ├── crime_tr10.csv
│   ├── crime_tr10_metadata.csv
│   └── ...
└── population
    ├── population_anc12.csv
    ├── population_anc12_metadata.csv
    ├── population_tr10.csv
    ├── population_tr10_metadata.csv
    └── ...
```

#### Notes
  * You should not need to run this command by hand; running `yarn start` / `yarn build` will run the `convert-data` task before everything else
  * Running `yarn convert-data` will automatically set `--from=./data`, and `--to=./app/assets/data`; if you wish to use a different values for these arguments, you can run the script directly using `node scripts/csv2json.js --from=source/folder --to=source/folder`;
  * The application was designed to expect data files to be present in `app/assets/data`. If this requirement changes for any reason, `app/lib/data.js` should be changed to reflect these changes.

Render target
---
By default, the app is configured to render in a div with id `#app`. If you wish to change the render target, you can do so when invoking `yarn start` / `yarn build` commands, by prepending `RENDER_TARGET="#my-div"` to the command. This value can be any valid CSS selector (as used by [`document.QuerySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)). Examples:

* `yarn build` will use `#app` as the render target;
* `RENDER_TARGET="#my-div"` will use `#my-div` as the render target;
* `RENDER_TARGET=".a-class .nested-class .nested-more-class"` will use `.nested-more-class` as the render target, provided the selector is correct; useful if for any reason you need to reference classes instead of just an ID

### Notes:

* There is no attempt to validate that the selector used is valid. If the app is not rendering, please check if `RENDER_TARGET` exists and is a valid selector.
* If using a class as `RENDER_TARGET`, `document.querySelector` will return the first element found, with the [behaviour described in the first note of `document.querySelector` documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

Assets Location
---
Because the application is designed to work as standalone or embedded in a non-root location, the `DATA_LOCATION` ENV var is used to tell the application where to load the assets from. If not specified, it defaults to `"."`.

### Example use:

* `DATA_LOCATION=path/to/assets yarn build`

### Notes:

* `DATA_LOCATION` _must not_ have a trailing slash (`"/"`)

Filter dropdowns
---

Filters are generated prior to building / running the application in development mode, and are output to `assets/data/filters.json`. This file contains the dependencies between different dropdowns, providing a lookup for which values should be displayed in each of the dropdowns after selections change. The file is structured as follows:

```js
{
  [geography]: {
    value: String (=== geography),
    label: String,
    topics: {
      [topic]: {
        value: String (=== topic),
        label: String,
        indicators: {
          [indicator]: {
            value: String (=== indicator),
            label: String,
            years: [
              value: String,
              label: String,
            ]
          }
        }
      }
    }
  },

  ...
}
```

At the top level, the object will contain a key for each geography present in the `geographies` export in `app/constants/taxonomy.js:17-25`. For each object present, the keys `label` and `value` are provided for using in a `select` element:

```
  <select>
    <option={value}>{label}</option>
    ...
   </select>
```

Drilling down further, we can get the possible values for the next dropdowns; these dropdowns should only be enabled / have values if the dropdown immediately before has a selected value.

This implies that:

* years can only be available if an indicator is selected
* indicators can only be available if a topic is selected
* topics can only be available if a geography is selected
* geographies will always be available to select
* when clearing the value of a dropdown, all dropdowns after that one should have their selected values / options cleared as well; e.g. If I select a new topic, indicators and years *must* be cleared;

#### Geography

Geography dropdown is code driven; the definition is in `/app/constants/taxonomy.js`

These values are used to build the Geography dropdown, and to reference the Tilesets uploaded to Mapbox (see `/app/support/map.js`), as well as their respective source layer and relevant key for the area, to link shapefile area with CSV data.

The constants defined in this file follow the notation below:

##### Geographies

* `GEO_OPT_*`: a key that links a geography dropdown option to the tileset / source layer for each type of geography; these values MUST match part of the filename that contains the data for the geography, as explained above
* `GEO_LABEL_*`: the label for each geography, used only for displaying dropdowns

##### Topics

* `TOPIC_OPT_*`: a key that links the topics to the data files; as detailed above, they MUST be all lower case; these values have a special significance: they MUST match the folders directly under the `/data` folder (case sensitive, all folders must be lowercased);
* `TOPIC_LABEL_*`: the label for each topic, used only for displaying dropdowns

Currently, there are 8 defined topics:

* Population
* Housing
* Income
* Education
* Health
* Safety
* Employment
* Connection

Adding more topics is a matter of adding new `TOPIC_OPT_` and `TOPIC_LABEL_` constants, and adding those to the `topics` constant;

Once more data is available, just make sure the `TOPIC_OPT_*` value matches the name of the folder, and data should be used automatically used.

#### Indicator / Year

Indicator and year are data-driven, so they should just work, provided the data is in good shape.

Help Text (Notes & Sources)
---

All notes & sources are expected to live in a `help-text.csv` file. This CSV must contain 3 columns:

* `level`: can be one of:
  * `geography`, `topic`, `indicator`, or `general`
* `item`: must match the data in the `data/**/*.csv` files if level is `geography`, `topic`, or `indicator`; can be other value if `level` is `general`
  * `level === "geography"`: Must be one of the values in `app/lib/data.js:23-31`, otherwise data can't be linked
  * `level === "topic"`: Must match one of the topics extracted from data folder (lowercase)
  * `level === "indicator"`: Must exist as a CSV column in whatever data we are looking at (case sensitive)
  * `level === "general"`: Must be one of `average`, `low`, or `high`
* `text`: whatever text should be shown in the Notes & Sources box

#### Generating a template

Run `yarn data-templates` to generate template CSVs that should be filled and placed in `/data/help-text.csv` to be converted and read by the application. The resulting file will be placed under `/templates/help-text.csv`.

##### NOTE:

This function assumes the existence of a valid `/app/assets/data/filters.json` file. If that's not the case, this task will fail. Please ensure that `yarn create-filters` ran successfuly prior to attempting to generate this template.

Updating existing data / adding new data
---

#### Ignoring columns

Because this application is designed to work with lots of different data sources, it is expected that some work will need to be done in order to maintain the application working as expected. To that end, one of the most important file is `app/constants/filters.js`. This file contains a list of all column names that should be ignored when building / displaying indicators in filters. Additionaly, all columns that end in `_nf`, `_m`, or `_moe` will be automatically ignored, without the need to manually add them to the blacklist.
