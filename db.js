const pg = require("pg").Pool;

const pool = new pg({
  user: "postgres",
  password: "postgres1304",
  host: "localhost",
  port: 5432,
  database: "charity",
});

module.exports = pool;
