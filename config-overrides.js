module.exports = {
  webpack: function (config, env) {
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.oneOf instanceof Array) {
        rule.oneOf[rule.oneOf.length - 1].exclude = [
          /\.(js|mjs|zbin|jsx|ts|tsx)$/,
          /\.html$/,
          /\.json$/,
        ];
        return {
          ...rule,
          oneOf: [
            {
              test: /zcv\.wasm$/,
              type: 'javascript/auto',
              loader: 'file-loader',
              options: {
                outputPath: 'static/js',
                publicPath: '.',
                name: '[name].[ext]',
              },
            },
            ...rule.oneOf,
          ],
        };
      }
      return rule;
    });

    config.resolve.extensions.push('.wasm');

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      fs: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
      path: require.resolve('path-browserify'),
    });
    config.resolve.fallback = fallback;

    // config.plugins = (config.plugins || []).concat([
    //   new webpack.ProvidePlugin({
    //     process: 'process/browser',
    //     Buffer: ['buffer', 'Buffer'],
    //   }),
    // ]);

    config.module.rules.push({
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: 'babel-loader',
    });

    config.module.rules.push({
      test: /\.worker\.js$/,
      use: [
        {
          loader: 'worker-loader',
          options: {
            esModule: false,
            inline: 'fallback',
            filename: '[name].js',
          },
        },
        // {
        //   loader: 'babel-loader',
        //   options: {
        //     presets: ['@babel/preset-env'],
        //   },
        // },
      ],
    });

    return config;
  },
  jest: function (config) {
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.https = true;
      return config;
    };
  },
  paths: function (paths, env) {
    return paths;
  },
};
