"use strict";

const db = require("./db");

// Return planes information
exports.getAllPlanes = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, type, rows, seats_per_row, tot_seats FROM planes", (err, rows) => {
      if (err) reject(err);
      if (rows == undefined) resolve({ error: "Plane not found" });
      else resolve(rows.map((e) => e));
    });
  });
};
