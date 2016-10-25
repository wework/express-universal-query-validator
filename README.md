express-universal-query-validator
====================

[![Build Status][travis-image]][travis-url]
[![Libraries.io for GitHub][librariesio-image]][librariesio-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]



[![Sauce Test Status][saucelabs-image]][saucelabs-url]

>Express middleware to provide consistently parseable query parameters to universal applications.

# Introduction

Normally, query parsing is handled by your server. For universal applications using something like `react-router`, this can be a problem when a different path is taken to parse query strings on the client vs the server.

For example, a Node express server will parse a malformed query like `?key=foo%%` using the native Node.js `querystring` module to `{ key: 'foo%%' }`. However, a client using `decodeURIComponent` will throw an error like `URIError: URI malformed` when encountering the same query.

This middleware solves this problem by validating each query parameter via `decodeURIComponent` and providing a callback to take action on the server when invalid params are detected. The default behavior when no callback is provided is to log and then redirect to the same path with unparseable params removed.

This package is tested in *both* Node.js and browsers to ensure the same behavior in both runtimes.

# Usage

```js
import express from 'express';
import queryValidator from 'express-universal-query-validator';

const app = express();

// Mount the middleware
app.use(queryValidator());

// Other route handlers
// ...

app.listen(process.env.PORT);
console.info(`Server listening on ${process.env.PORT} and handling invalid query parameters`);

```

## Configuration

[`queryValidator`](API.md#queryValidator) accepts a callback that is executed when invalid params are detected, and a configuration object.

See [API.md](API.md) for detailed documentation.

## Examples

```js

function invalidParamHandler(req, res, next, context) {
    const { error, oldQuery, nextQuery, droppedParams } = context;

    // Do what you love
}

app.use(queryValidator(invalidParamHandler));

```


# Development

In lieu of a formal style guide, please ensure PRs follow the conventions present, and have been properly linted and tested. Feel free to open issues to discuss.

Be aware this module is tested in both browser and node runtimes.

## Available tasks

### Build and test
Runs all tests, static analysis, and bundle for distribution
```shell
$ npm start
```

### Test
Runs browser and node tests
```shell
$ npm test
```

Runs browser tests via PhantomJS only
```shell
$ npm run test:browser
```

Runs browser tests via SauceLabs only
```shell
$ SAUCELABS=true npm run test:browser
```

Runs node tests only
```shell
$ npm run test:node
```

### Docs
Regenerate [API.md](API.md) docs from JSDoc comments
```shell
$ npm run docs
```



[npm-url]: https://npmjs.org/package/express-universal-query-validator
[npm-version-image]: http://img.shields.io/npm/v/express-universal-query-validator.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/express-universal-query-validator.svg?style=flat-square

[coveralls-image]:https://coveralls.io/repos/github/wework/express-universal-query-validator/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/wework/express-universal-query-validator?branch=master

[travis-url]:https://travis-ci.org/wework/express-universal-query-validator
[travis-image]: https://travis-ci.org/wework/express-universal-query-validator.svg?branch=master

[saucelabs-image]:https://saucelabs.com/browser-matrix/query-validator.svg
[saucelabs-url]:https://saucelabs.com/u/query-validator

[license-url]: LICENSE
[license-image]: http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square

[librariesio-url]: https://libraries.io/npm/express-universal-query-validator
[librariesio-image]: https://img.shields.io/librariesio/github/wework/express-universal-query-validator.svg?maxAge=2592000

