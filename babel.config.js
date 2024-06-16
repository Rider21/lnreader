module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@components': './src/components',
            '@database': './src/database',
            '@hooks': './src/hooks',
            '@screens': './src/screens',
            '@strings': './strings',
            '@redux': './src/redux',
            '@services': './src/services',
            '@plugins': './src/plugins',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@navigators': './src/navigators',
            '@native': './src/native',
            '@api': './src/api',
            'crypto': 'react-native-quick-crypto',
            'stream': 'readable-stream',
            'buffer': '@craftzdog/react-native-buffer',
          },
        },
      ],
      'react-native-reanimated/plugin',
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};
