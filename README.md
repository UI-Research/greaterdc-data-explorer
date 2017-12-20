Greater DC Data Explorer
===

* Dev requirements:
    * `node >= v8.6.0`

* Run:
    * `yarn start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `yarn build` — builds minified project for production

* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * Place all csv files for conversion in the folder `/data` (create if not present), with 1 folder per topic (`/data/crime`, `/data/population`, ...)
       * All files and folder should be in lowercase
    * Folders and files MUST follow this structure:
       * `<topic>/<topic>_<geography>.csv`
       * `<topic>/<topic>_<geography>..metadata` (the `..` is not an error)

Example `/data` folder structure:

```
data
├── crime
│   ├── crime_anc12.csv
│   ├── crime_anc12_metadata..csv
│   ├── crime_tr10.csv
│   ├── crime_tr10_metadata..csv
│   └── ...
└── population
    ├── population_anc12.csv
    ├── population_anc12_metadata..csv
    ├── population_tr10.csv
    ├── population_tr10_metadata..csv
    └── ...
```

CSV Conversion
---

* Run
    * `yarn convert-data` - converts all `.csv` files under `/data` to their `JSON` counterparts; converted files are placed in `app/assets/data/`, with the same folder structure as the original `/data` folder; original files will be copied to the destination folder to allow downloading

* Notes
    * You should not need to run this command by hand; running `yarn start` / `yarn build` will run the `convert-data` task before everything else
    * Running `yarn convert-data` will automatically set `--from=./data`, and `--to=./app/assets/data`; if you wish to use a different values for these arguments, you can run the script directly using `node scripts/csv2json.js --from=source/folder --to=source/folder`;
    * The application was designed to expect data files to be present in `app/assets/data`. If this requirement changes for any reason, `app/lib/data.js` should be changed to reflect these changes.

Filter dropdown configuration
---

#### Geography / Topic

Geography and Topic dropdowns are code driven; their definitions are in `/app/constants/taxonomy.js`

These values are used to build the Geography dropdown, and to reference the Tilesets uploaded to Mapbox (see `/app/support/map.js`), as well as their respective source layer and relevant key for the area, to link shapefile area with CSV data.

The constants defined in this file follow the notation below:

##### Geographies

- `GEO_OPT_*`: a key that links a geography dropdown option to the tileset / source layer for each type of geography; these values MUST match part of the filename that contains the data for the geography, as explained above
- `GEO_LABEL_*`: the label for each geography, used only for displaying dropdowns

Adding more geographies is a matter of adding new `GEO_OPT_` and `GEO_LABEL_` constants, and adding those to the `geographies` constant;

##### Topics

- `TOPIC_OPT_*`: a key that links the topics to the data files; as detailed above, they MUST be all lower case; these values have a special significance: they MUST match the folders directly under the `/data` folder (case sensitive, all folders must be lowercased);
- `TOPIC_LABEL_*`: the label for each topic, used only for displaying dropdowns

Adding more geographies is a matter of adding new `TOPIC_OPT_` and `TOPIC_LABEL_` constants, and adding those to the `topics` constant;

Currently, there are 13 defined topics, but, due to the lack of available data, only `crime` and `income` topics are enabled; to display more topics, simply uncomment them in the `topics` constant.

Once more data is available, just make sure the `TOPIC_OPT_*` value matches the name of the folder, and data should be used automatically used.

#### Indicator / Year

Indicator and year are data-driven, so they should just work, provided the data is in good shape.
