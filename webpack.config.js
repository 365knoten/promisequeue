const path = require("path");
const DeclarationBundlerPlugin = require('declaration-bundler-webpack-plugin');
const TSLintPlugin = require('tslint-webpack-plugin');
const pkg = require("./package.json");


module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: pkg.name + ".js", // Desired file name. Same as in package.json's "main" field.
    path: path.resolve(__dirname, "dist"),
    //library: pkg.name, // Desired name for the global variable when using as a drop-in script-tag.
    //libraryTarget: "umd",
    //globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    new TSLintPlugin({
      files: ['./src/**/*.ts']
    }),
    new DeclarationBundlerPlugin({
      moduleName: pkg.name,
      out: pkg.name + '.d.ts',
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', 'js'],
    modules: ['node_modules']
  },
  // If using an external dependency that should not get bundled, e.g. React
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react"
    }
  }
};
