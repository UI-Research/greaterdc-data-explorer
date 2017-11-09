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

CSV Conversion
---

* Requirements
    * `Ruby >= 2.0.0`

* Run
    * `ruby scripts/csv2json.rb path/to/file.csv` - converts a single CSV file to a JSON array, and saves the new file in the same location as the original one, with a `.json` extension
