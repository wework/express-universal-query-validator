const webpackClientConfig = require('./webpack.client.config');
const saucelabsBrowsers = require('./saucelabs-browsers.json').browsers;

module.exports = function(config) {
  // Default
  let browsers = ['PhantomJS'];
  // Saucelabs run
  if (process.env.SAUCELABS === 'true') {
    browsers = Object.keys(saucelabsBrowsers);
  }

  // karma configuration
  config.set({
    basePath: '../',
    autoWatch: true,
    singleRun: true,
    frameworks: ['mocha'],
    sauceLabs: {
      build: process.env.TRAVIS_JOB_ID,
      testName: process.env.LIBRARY_NAME
    },
    browserNoActivityTimeout: 120000,
    concurrency: 2,
    customLaunchers: saucelabsBrowsers,
    files: [
      'test/browser.index.js'
    ],
    browsers: browsers,
    reporters: process.env.SAUCELABS ? ['mocha', 'saucelabs', 'coverage'] : ['mocha', 'coverage'],

    mochaReporter: {
      output: 'autowatch',
      showDiff: true
    },

    preprocessors: {
      'test/browser.index.js': ['webpack']
    },

    // webpack test configuration
    webpack: webpackClientConfig,

    // webpack-dev-middleware configuration
    webpackMiddleware: {
      stats: 'errors-only'
    },

    coverageReporter: {
      dir: './coverage/browser',
      reporters: [
        { type: 'text-summary' },
        { type: 'html' },
        { type: 'lcov' },
        { type: 'cobertura' }
      ]
    }
  });
};
