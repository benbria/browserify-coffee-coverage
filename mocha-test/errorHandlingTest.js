var expect = require('chai').expect;
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var coverage = require('../');

/**
 * Execute the instrumented javascript in its own context to verify the coverage results are valid.
 */
function execute(src) {
    var ctx = {};
    try {
        vm.runInNewContext(src, ctx);
    } catch (err) {
        console.log('Error thrown while executing instrumented code');
        console.error(err);
    }
    return ctx;
}

describe('Test Edge Cases', function() {
    describe('non coffee files', function() {
        it('should pass through js src', function(cb) {
            var b = browserify();
            b.add('./testFixtures/notCoffee.js');
            b.transform(coverage);
            b.bundle(function(err, buf) {
                expect(err).to.not.be.ok;
                var results = execute(buf);
                expect(results._$jscoverage).to.not.be.ok;
                cb()
            });
        })
    })
});
