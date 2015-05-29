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
});
