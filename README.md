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

* Requirements
    * `Ruby >= 2.0.0`

* Run
    * `yarn convert-data` - converts all `.csv` files under `/data` to their `JSON` counterparts; converted files are placed in `app/assets/data/`, with the same folder structure as the original `/data` folder

* Notes
    * You should not need to run this command by hand; running `yarn start` / `yarn build` will run the `convert-data` task before everything else
