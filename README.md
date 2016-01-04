[![Build Status](https://travis-ci.org/yochannah/cytoscape-intermine.svg?branch=master)](https://travis-ci.org/yochannah/cytoscape-intermine)

## About
This project takes gene interaction data from [Intermine](https://github.com/intermine/intermine) and visualises it using [cytoscape.js](http://js.cytoscape.org/), a fabulous network visualisation tool.

Demo at [yochannah.github.io/cytoscape-intermine/](http://yochannah.github.io/cytoscape-intermine/).

## Quick Start

TL;DR: See the [source](https://github.com/yochannah/cytoscape-intermine/blob/master/index.html) of the [demo page](http://yochannah.github.io/cytoscape-intermine/).

### Detailed steps:
If you don't care about building the script, just download or check out **dist/bundle.js** and **dist/style.css**.
Include links to both in your project page, e.g.:

    <link href="dist/style.css" rel="stylesheet" type="text/css">
    <script src="dist/bundle.js"></script>

#### To initialise the graph:

You'll need to pass an object that contains the following properties:

* `service`: An object, that at a minimum contains a `root` property pointing to [Intermine Service](http://iodocs.labs.intermine.org/), e.g `service : {root : 'http://www.flymine.org/query/service/'}`. Optionally can take a `token` property as well.
* `queryOn`: This is a **term to query on** (e.g. a gene name or 'primaryIdentifier'). This is in the format of an object, such as `{"value" : "FBgn0034249"}` or `{"value" : "PPARG", "extraValue" : "H. sapiens"}`.
* `parentElem`: An **element to insert the graph into**, e.g. `document.getElementById('myAwesomeElement');`. If this isn't specified, the graph will try to find an element with the ID `cymine`.
* `nodeType`: Optional, will default to gene. Mandatory for Protein queries. Values are `Gene` or `Protein`.
* `compact`: optional. If there are no results, if this argument is truthy, the 'sorry, no interactions for this search' message is 1.5em high, not 350px.

#### Gluing them all together, the body of your HTML page might look something like this:

    <div id="myAwesomeElement"></div>
    <script>
    cymine({
      parentElem : document.getElementById('myAwesomeElement'),
      service : {
        root : "http://beta.flymine.org/beta/service/", //mandatory
        token : "" //optional
        },
      queryOn : {
        "value" : "FBgn0034249"
      },
      nodeType : "Gene",
      compact : true //optional
    });
    </script>

## Modifying / running the project locally
### Dependencies
We'll assume you have [npm](https://nodejs.org/download/) installed already.

### Installation

In terminal:

    $ npm install
    $ bower install

That should be it!

### Running the project

If you want to modify the script and let Browsersync live-reload your changes, run:

    $ gulp dev

If you just want a one-off build, gulp's default task will do it:

    $ gulp

Both tasks will compile your less (make sure to prefix partials with `_`, e.g. `_button.less`) and bundle up your js, then move it to the dist folder.

#### Testing

  Run `$ mocha` (to run the suite once) or `$ mocha --watch` (to re-test when you make changes).

### Query notes

To get this working with objectId arguments, initialise with `"op" : "="` on the queryOn object, e.g.

    <div id="myAwesomeElement"></div>
    <script>
    cymine({
      parentElem : document.getElementById('myAwesomeElement'),
      service : {
        root : "http://beta.flymine.org/beta/service/", //mandatory
        token : "" //optional
        },
      queryOn : {
        "value" : 1449024,
        "op" : "="
      },
      nodeType : "Gene"
    });
    </script>
