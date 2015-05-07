var expect = chai.expect;
var foo = require('../testFixtures/foo.coffee');

describe('Karma Coverage Support', function() {
    it('if path', function() {
        expect(foo(true)).to.not.be.ok;
    });
});
