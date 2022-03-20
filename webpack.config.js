const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PUBLIC_PATH = path.join(__dirname, "public");
const SRC_PATH = path.join(__dirname, "app");

const webpackConfig = {
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./app/index.html"),
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./app/img",
          to: "./img",
        },
      ],
    }),
  ],

  entry: `${SRC_PATH}/index.js`,
  output: {
    filename: "bundle.js",
    path: PUBLIC_PATH,
  },
  module: {
    rules: [
      { test: /\.hbs$/, use: ["handlebars-loader"] },
      {
        test: /\.(js)$/,
        exclude: /node_modules|/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    static: path.resolve(__dirname, "./public"),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
};
module.exports = webpackConfig;
