var mysql = require('mysql');
var settings = require('./dbSetting');

var pool = mysql.createPool({
  host: settings.mysql.host,
  port: settings.mysql.port,
  database: settings.mysql.database,
  user: settings.mysql.user,
  password: settings.mysql.password,
  charset: "utf8",
  connectionLimit: settings.mysql.connectionLimit
})

module.exports = pool;
