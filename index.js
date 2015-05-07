var path = require('path');
var through = require('through2');
var coffee = require('coffee-script');
var coffeeCoverage = require('coffee-coverage');
var minimatch = require('minimatch');

var CoverageInstrumentor = coffeeCoverage.CoverageInstrumentor;
// Just use the default Istanbul coverage variable.
var COVERAGE_VAR = '__coverage__';
var defaultIgnore = [
    '**/node_modules/**',
    '**/bower_components/**',
    '**/test/**',
    '**/tests/**',
];

/**
 * Transform coffee source into javascript with either JScoverage or Istanbul style instrumentation
 *
 * `options` {Object} - all options that can be passed to this
 * [function](https://github.com/benbria/coffee-coverage/blob/v0.5.4/src/coffeeCoverage.coffee#L270)
 */
module.exports = function(file, options) {
    if (!options) options = {};
    options.coverageVar = COVERAGE_VAR;
    var ignore = defaultIgnore.concat(options.ignore || []);
    options.ignore = null;
    var instrumentor = new CoverageInstrumentor(options);

    /**
     * if it isn't coffee, we can't do anything with it
     *
     * If in the list of ignored paths, don't instrument, just coffeeify. We do this here instead of in
     * coffee-coverage, as coffee-coverage works on the file system. Since we are getting piped the files,
     * we bypass coffee-coverage's filesystem code.
     *
     * else instrument and coffeeify (which is done by coffee-coverage)
     */
    function instrument(buf, enc, cb) {
        var transformed,
        code = buf.toString('utf8');
        if (!/coffee/.test(path.extname(file))) {
            transformed = buf;
        }
        else if (ignore.some(minimatch.bind(null, file))) {
            var data = coffee.compile(code, {
                sourceMap: true,
                generatedFile: file,
                inline: true,
                literate: false
            });
            transformed = new Buffer(data.js);
        }
        else {
            var instrumented = instrumentor.instrumentCoffee(file, code);
            transformed = new Buffer(instrumented.init + instrumented.js);
        }
        cb(null, transformed);
    }

    return through.obj(instrument);
}
