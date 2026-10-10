const { Pool } = require("pg");

const pool = new Pool({
  user: "user",
  host: "neomarketdb",
  database: "neomarketdb",
  password: "f5SFbvns8acHGFD854sq",
  port: 5432,
});

module.exports = pool;
