require('dotenv').config();

var config = {};

config.node_env = process.env.NODE_ENV

//web config
config.web = {};
config.web.port = process.env.PORT;

//db config
config.db = {};
config.db.host = process.env.DB_HOST;
config.db.username = process.env.DB_USERNAME;
config.db.password = process.env.DB_PASSWORD;
config.db.database = process.env.DB_DATABASE;
config.db.port = process.env.DB_PORT;
config.db.dialect = process.env.DB_DIALECT;

module.exports = config;