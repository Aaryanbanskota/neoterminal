const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = env && env.analyze;

  const config = {
    target: 'electron-renderer',
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    entry: {
      main: './src/renderer/main.tsx',
      quantum: './src/renderer/quantum/visualizer.ts',
      security: './src/renderer/security/scanner.ts'
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].[contenthash].chunk.js',
      assetModuleFilename: 'assets/[hash][ext][query]',
      publicPath: './',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@components': path.resolve(__dirname, '../src/renderer/components'),
        '@libs': path.resolve(__dirname, '../src/renderer/libs'),
        '@assets': path.resolve(__dirname, '../assets')
      },
      fallback: {
        "path": require.resolve("path-browserify"),
        "fs": false,
        "crypto": false
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            }
          }
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        },
        {
          test: /\.(css|scss)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: isProduction 
                    ? '[hash:base64]' 
                    : '[path][name]__[local]'
                }
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|glb|gltf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]'
          }
        },
        {
          test: /\.(mp3|wav|ogg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'sounds/[hash][ext][query]'
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
        'process.env.APP_VERSION': JSON.stringify(require('../package.json').version)
      }),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    ],
    externals: [
      nodeExternals({
        allowlist: [
          /webpack(\/.*)?/,
          'electron-devtools-installer',
          /\.(css|sass|scss)$/
        ]
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      },
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 2020,
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction
            },
            format: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    },
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }
  };

  if (isAnalyze) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  if (!isProduction) {
    config.devServer = {
      hot: true,
      compress: true,
      port: 3000,
      static: {
        directory: path.join(__dirname, '../dist')
      },
      devMiddleware: {
        writeToDisk: true
      },
      historyApiFallback: true
    };
  }

  return config;
};