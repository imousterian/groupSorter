import * as webpackConfig from './webpack.config';

let coverageEnabled = process.env.NO_COVERAGE !== 'true';

module.exports = function (config) {
  let _config = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: './karma-shim.js', watched: false }
    ],
    // list of files to exclude
    exclude: [],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './karma-shim.js': ['coverage', 'webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: { stats: 'errors-only'},

    webpackServer: {
      noInfo: true // please don't spam the console when running in karma!
    },

    reporters: <any>["mocha"],
    port: 9876,
    colors: true,
    /*
     * level of logging
     * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    singleRun: true
  };

  if (coverageEnabled) {
    _config.reporters.push( 'coverage', 'remap-coverage');
    _config['coverageReporter'] = {
        type: 'in-memory'
    };

    _config['remapCoverageReporter'] = {
        'text-summary': null,
        html: './coverage/istanbul'
    };
  }
  config.set(_config);
};
