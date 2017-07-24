// Helper: root() is defined at the bottom
import * as path from 'path';
const webpack = require('webpack');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');

let nodeEnv = process.env.NODE_ENV || 'development';
let portNum = process.env.PORT_NUM || 8200;

let coverageEnabled = process.env.NO_COVERAGE !== 'true';
let isTest = nodeEnv === 'test';
let isProd = nodeEnv === 'production';

module.exports = function makeWebpackConfig() {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {
    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    devtool: 'eval-source-map',
    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: <any>{
      'polyfills': './src/polyfills.ts',
      'vendor': './src/vendor.ts',
      'app': './src/main.ts' // our angular app
    },
    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    output: <any>{
      path: root('../dist'),
      publicPath: isProd ? '/' : 'http://localhost:' + portNum + '/',
      filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
      chunkFilename: isProd ? '[id].[hash].chunk.js' : '[id].chunk.js'
    },
    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {
      // only discover files that have those extensions
      extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
    },
    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    module: {
      rules: <any>[
        // Support for .ts files.
        {
          test: /\.ts$/, // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
          loaders: ['awesome-typescript-loader?' + (isTest && coverageEnabled ? 'inlineSourceMap=true&sourceMap=false' : ''), 'angular2-template-loader', '@angularclass/hmr-loader'],
          exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
        },
        // copy those assets to output
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
        },
        // Support for *.json files.
        {test: /\.json$/, loader: 'json-loader'},
        // Support for CSS as raw text
        // use 'null' loader in test mode (https://github.com/webpack/null-loader)
        // all css in src/style will be bundled in an external css file
        {
          test: /\.css$/,
          exclude: root('../src', 'app'),
          loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader']})
        },
        // all css required in src/app files will be merged in js files
        {test: /\.css$/, include: root('../src', 'app'), loader: 'raw-loader'},
        // support for .scss files
        // use 'null' loader in test mode (https://github.com/webpack/null-loader)
        // all css in src/style will be bundled in an external css file
        {
          test: /\.(scss|sass)$/,
          exclude: root('../src', 'app'),
          loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader', 'sass-loader']})
        },
        // all css required in src/app files will be merged in js files
        {test: /\.(scss|sass)$/, exclude: root('../src', 'style'), loader: 'raw-loader!sass-loader'},
        // support for .html as raw text
        // todo: change the loader to something that adds a hash to images
        {test: /\.html$/, loader: 'raw-loader',  exclude: root('./src')}
      ]
    },
    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    plugins: [
      // Define env variables to help with builds
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
      new webpack.DefinePlugin({
        // Environment helpers
        'process.env': {
          'NODE_ENV': JSON.stringify(nodeEnv)
        }
      }),

      // Workaround needed for angular 2 angular/angular#11580
        new webpack.ContextReplacementPlugin(
          // The (\\|\/) piece accounts for path separators in *nix and Windows
          /angular(\\|\/)core(\\|\/)@angular/,
          path.resolve(__dirname, '../src') // location of your src
        ),

      // Tslint configuration for webpack 2
      new webpack.LoaderOptionsPlugin({
        options: {
          /**
           * Apply the tslint loader as pre/postLoader
           * Reference: https://github.com/wbuchwalter/tslint-loader
           */
          tslint: {
            emitErrors: false,
            failOnHint: false
          },
          /**
           * Sass
           * Reference: https://github.com/jtangelder/sass-loader
           * Transforms .scss files to .css
           */
          sassLoader: {
            //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
          }
        }
      }),
      new StringReplacePlugin()
    ],
    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    devServer: {
      contentBase: './src',
      historyApiFallback: true,
      quiet: true,
      stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
    }
  };

  if (isProd) {
    config.devtool = 'source-map';

    // Add build specific plugins
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin(),

      // // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // // Dedupe modules in the output
      // new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({sourceMap: true, mangle: { keep_fnames: true }}),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([
        { from: root('../src/service-worker.js') },
        { from: root('../src/assets/img'), to: 'assets/img' }
      ])
    );
  } else if (isTest) {
    config.devtool = 'inline-source-map';
    delete(config.entry);
    config.output = {};

    if (coverageEnabled) {
      // instrument only testing sources with Istanbul, covers ts files
      config.module.rules.push({
        test: /\.ts$/,
        enforce: 'post',
        include: path.resolve('./src'),
        loader: 'istanbul-instrumenter-loader',
        exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
      });
    }
  }

  if (!isTest) {
    // tslint support
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader'
    });

    config.plugins.push(
      // Generate common chunks if necessary
      // Reference: https://webpack.github.io/docs/code-splitting.html
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      new CommonsChunkPlugin({
        name: ['vendor', 'polyfills']
      }),

      // Inject script and link tags into html files
      // Reference: https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: './src/index.html',
        chunksSortMode: 'dependency'
      }),

      // Extract css files
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Disabled when in test mode or not in build mode
      new ExtractTextPlugin({filename: 'css/[name].[hash].css', disable: !isProd})
    );
  }
  return config;
}();

// Helper functions
function root(...args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
