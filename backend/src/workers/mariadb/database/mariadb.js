const maria = require("mysql");
const dbConfig = require("./mariadbConfig");

const mariaConnection = maria.createConnection(dbConfig);

mariaConnection.connect((error) => {
  if (error) throw error;
  console.debug("MariaDB is Connected!");
});

module.exports = mariaConnection;
