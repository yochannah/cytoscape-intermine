## About
This project takes gene interaction data from [Intermine](https://github.com/intermine/intermine) and visualises it using [cytoscape.js](http://js.cytoscape.org/), a fabulous network visualisation tool.

Demo at [yochannah.github.io/cytoscape-intermine/](http://yochannah.github.io/cytoscape-intermine/).

## Quick Start

TL;DR: See the [demo page](http://yochannah.github.io/cytoscape-intermine/).

### Detailed steps:
If you don't care about building the script, just download or check out **dist/bundle.js** and **dist/style.css**.
Include links to both in your project page, e.g.:

    <link href="dist/style.css" rel="stylesheet" type="text/css">
    <script src="dist/bundle.js"></script>

#### To initialise the graph, you'll need the following things:

* **A [URL to an Intermine Service](http://iodocs.labs.intermine.org/)**.
* **A term to query on** (e.g. a gene name or 'primaryIdentifier'). This is in the format of an object, such as `{"value" : "FBgn0034249"}` or `{"value" : "PPARG", "extraValue" : "H. sapiens"}` .
* **An element to insert the graph into**, e.g. `document.getElementById('anAwesomeElement');`. If this isn't specified, the graph will try to find an element with the ID `cymine`.

#### Gluing them all together, the body of your HTML page might look something like this:

    <div id="myAwesomeElement"></div>
    <script>
    cymine({
      parentElem : document.getElementById('myAwesomeElement'),
      serviceUrl : "http://beta.flymine.org/beta/service/",
      queryOn : {
        "value" : "FBgn0034249"
      }
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
