"use strict";

const sqlite = require("sqlite3");

// Database connection
const db = new sqlite.Database("airplane-seats.db", (err) => {
  if (err) console.error("Could not connect to database", err);
  else console.log("Connected to database");
});

module.exports = db;
