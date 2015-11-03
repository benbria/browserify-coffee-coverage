'use strict';
var path = require('path');
var through = require('through');
var coffee = require('coffee-script');
var coffeeCoverage = require('coffee-coverage');
var minimatch = require('minimatch');
var assign = require('object-assign');

var CoverageInstrumentor = coffeeCoverage.CoverageInstrumentor;
// Just use the default Istanbul coverage variable.
var ISTANBUL_COVERAGE_VAR = '__coverage__';
var defaultIgnore = [
    '**/node_modules/**',
    '**/bower_components/**',
    '**/test/**',
    '**/tests/**',
];

/**
 * borrowed from https://github.com/substack/coffeeify/blob/master/index.js
 */

function isCoffee (file) {
    return /\.((lit)?coffee|coffee\.md)$/.test(file);
}

function isLiterate (file) {
    return /\.(litcoffee|coffee\.md)$/.test(file);
}

/**
 * Transform coffee source into javascript with either JScoverage or Istanbul style instrumentation
 *
 * `options` {Object} - all options that can be passed to this
 * [function](https://github.com/benbria/coffee-coverage/blob/v0.5.4/src/coffeeCoverage.coffee#L270) plus these:
 *
 * `options.ignore` {Array} - file patterns to not instrument
 * `options.noInit` {Boolean} - default to `false`. Use this if you do not want the initialization (which adds the file
 * being transformed to the global coverage object). There may be cases where you'd want to control this.
 */
module.exports = function(file, passedOptions) {
    if (!isCoffee(file)) return through();

    var options = {};
    if (passedOptions) assign(options, passedOptions);
    if (!options.coverageVar && options.instrumentor === 'istanbul') {
        options.coverageVar = ISTANBUL_COVERAGE_VAR;
    }
    if (typeof options.bare === 'undefined') options.bare = true;
    var ignore = defaultIgnore.concat(options.ignore || []);
    options.ignore = null;
    var instrumentor = new CoverageInstrumentor(options);

    var data = '';
    return through(write, end);

    function write(buf) { data += buf; }

    /**
     * If in the list of ignored paths, don't instrument, just coffeeify. We do this here instead of in
     * coffee-coverage, as coffee-coverage works on the file system. Since we are getting piped the files,
     * we bypass coffee-coverage's filesystem code.
     *
     * else instrument and coffeeify (which is done by coffee-coverage)
     */
     function end() {
        var transformed;
        if (ignore.some(minimatch.bind(null, file))) {
            var compiled = coffee.compile(data, {
                sourceMap: true,
                generatedFile: file,
                inline: true,
                bare: options.bare,
                literate: isLiterate(file)
            });
            transformed = compiled.js;
        }
        else {
            var instrumented = instrumentor.instrumentCoffee(file, data);
            var js = options.noInit ? instrumented.js : instrumented.init + instrumented.js;
            transformed = js;
        }
        this.queue(transformed);
        this.queue(null);
    }
}
