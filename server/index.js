const dns = require('node:dns/promises');

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const config = require('./utils/config');
const logger = require('./utils/logger');
const app = require('../app');

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})