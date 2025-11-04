module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: './frontend.env', // specify custom env file
    }],
  ],
};
