const withTM = require('next-transpile-modules')([
  '@lottery-dapp/smart-contract',
]);

module.exports = withTM({
  reactStrictMode: true,
});
