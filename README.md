# browserify-coffee-coverage

A browserify transform to take `.coffee` files and compile them into `.js` with coverage instrumentation using
[coffee-coverage](https://github.com/benbria/coffee-coverage). `coffee-coverage` supports
[istanbul](https://github.com/gotwarlost/istanbul) and [jscoverage](http://siliconforks.com/jscoverage/)

# Usage

```javascript
var coverage = require('browserify-coffee-coverage');
var b = browserify();
b.add('./foo.coffee');
var options = { noInit: false };
b.transform(coverage, options);
b.bundle();
```

# Options

You can pass anything that you would pass to the `coffee-coverage` constructor, as well as these specific transform
options.

## `options.noInit`

`coffee-coverage` instruments your coffee with lines like `__coverage__["./foo.coffee"].s[1]++;`. For each file, it will
 produce the intialization code to make sure `__coverage__` (In this case the `istanbul` global coverage var) is
 properly setup. You can either choose to either have this initialization code inlined into the transformed file, or
 omit it. There are cases where you might want to omit it, and grab it yourself.

 defaults to `false`.
