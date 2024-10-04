# 🦊 FablePictor development

## Architecture

Fablepictor works on the basis of CSV data file (`data/data.csv`) with a certain structure. There is a build step executes a Python script, which takes the data from this CSV file and transforms it into a number of JSON files.

These JSON files then serve as the backend for the frontend application. They contain the descriptive metadata (`metadata.json`), a search index (`index.json`) and the IIIF identifiers (`identifiers.json`). These are handled and queried with `index.html` and `index.js`.

All frontend elements (favicon, Bootstrap CSS, etc.) are present in the git repository.

## Build

In order to build the website, go to the `data` directory and execute `make build`.

## Testing

In order to test the website, you can spin up a Go webserver (`server/server.go`) and use the website on localhost.

## Deployment

This website is deployed on GitHub Pages. The only necessary step is to push the new version to GitHub.
