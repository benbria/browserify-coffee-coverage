var fs = require('fs');
var path = require('path');
var punycode = require('punycode');
var expect = require('chai').expect

describe('Verify coverage of karma-coverage', function() {
    var coverageLine = fs.readFileSync(path.resolve(__dirname,'../coverage/coverage.txt'))
        .toString('utf8')
        .split('\n')
        .filter(function(line) {
            return line.match(/foo.coffee/);
        })[0]
        .replace(/\[\d+/g, '');

    it('should have the right coverage counts', function() {
        var counts = coverageLine.match(/\d+/g);
        expect(counts).to.eql(['50', '25', '100', '50']);
    });
});
