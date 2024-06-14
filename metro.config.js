const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const path = require('path');
const fs = require('fs');

const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

const config = {
  server: {
    port: 8081,
    enhanceMiddleware: (metroMiddleware, metroServer) => {
      return (request, res, next) => {
        const filePath = path.join(
          __dirname,
          'android/app/src/main',
          request._parsedUrl.path || '',
        );
        const ext = path.parse(filePath).ext;
        if (fs.existsSync(filePath)) {
          try {
            const data = fs.readFileSync(filePath);
            res.setHeader('Content-type', map[ext] || 'text/plain');
            res.end(data);
          } catch (err) {
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          }
        } else {
          return metroMiddleware(request, res, next);
        }
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
