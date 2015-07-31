##About
This project takes gene interaction data from [Intermine](https://github.com/intermine/intermine) and visualises it using [cytoscape.js](http://js.cytoscape.org/), a fabulous network visualisation tool.

Demo at [yochannah.github.io/cytoscape-intermine/](yochannah.github.io/cytoscape-intermine/).

##Setup
###Dependencies
We'll assume you have [npm](https://nodejs.org/download/) installed already.

###Installation

In terminal:

    $ npm install
    $ bower install

That should be it!

###Running the project

If you want to modify the script and let Browsersync live-reload your changes, run:

    $ gulp dev

If you just want a one-off build, gulp's default task will do it:

    $ gulp

Both tasks will compile your less (make sure to prefix partials with `_`, e.g. `_button.less`) and bundle up your js, then move it to the dist folder.

####Testing

  Run `$ mocha` (to run the suite once) or `$ mocha --watch` (to re-test when you make changes).
