var expect = require('chai').expect;
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

var coverage = require('../');
var execute = require('./utils').execute;

describe('Options', function() {
    describe('ignore', function() {
        it('should ignore specified files', function(cb) {
            var b = browserify();
            b.add('./testFixtures/if.coffee');
            b.add('./testFixtures/ignoreMe.coffee');
            b.add('./testFixtures/alsoIgnore.coffee');
            b.transform(coverage, {
                instrumentor: 'istanbul',
                ignore: [
                    '**/*ignoreMe**',
                    '**/*alsoIgnore**'
                ]
            });
            b.bundle(function(err, buf) {
                if (err) return cb(err);
                var results = execute(buf);
                var ignores = [
                    path.resolve(__dirname + '/../testFixtures/ignoreMe.coffee'),
                    path.resolve(__dirname + '/../testFixtures/alsoIgnore.coffee')
                ];
                expect(results.__coverage__).to.be.ok;
                expect(results.__coverage__[ignores[0]]).to.not.exist;
                expect(results.__coverage__[ignores[0]]).to.not.exist;
                cb()
            });
        });
    });

    describe('literate coffee', function () {
        it('should compile .litcoffee files', function(cb) {
            var b = browserify();
            b.add('./testFixtures/foo.litcoffee');
            b.transform(coverage, {
                instrumentor: 'istanbul'
            });
            b.bundle(function(err, buf) {
                if (err) return cb(err);
                var results = execute(buf);
                var entry = path.resolve(__dirname + '/../testFixtures/foo.litcoffee');
                expect(results.__coverage__[entry]).to.be.ok;
                expect(results.__coverage__[entry].s[3]).to.eq(1);
                cb()
            });
        });

        it('should compile .coffee.md files', function(cb) {
            var b = browserify();
            b.add('./testFixtures/bar.coffee.md');
            b.transform(coverage, {
                instrumentor: 'istanbul'
            });
            b.bundle(function(err, buf) {
                if (err) return cb(err);
                var results = execute(buf);
                var entry = path.resolve(__dirname + '/../testFixtures/bar.coffee.md');
                expect(results.__coverage__[entry]).to.be.ok;
                expect(results.__coverage__[entry].s[3]).to.eq(1);
                cb()
            });
        });
    });
});
