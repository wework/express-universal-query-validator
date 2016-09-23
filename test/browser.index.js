require('./runner');

// require all `/test/specs/**/*.js`
const testsContext = require.context('./specs/', true, /\.js$/);
testsContext.keys().forEach(testsContext);

// require all `/src/**/*.js`
const componentsContext = require.context('../src/', true, /\.js$/);
componentsContext.keys().forEach(componentsContext);