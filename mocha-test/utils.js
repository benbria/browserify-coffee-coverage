var vm = require('vm');

/**
 * Execute the instrumented javascript in its own context to verify the coverage results are valid.
 */
exports.execute = function execute(src) {
    var ctx = {};
    try {
        vm.runInNewContext(src, ctx);
    } catch (err) {
        console.log('Error thrown while executing instrumented code');
        console.error(err);
    }
    return ctx;
}
