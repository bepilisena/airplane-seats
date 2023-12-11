"use strict";

const db = require("./db");
const crypto = require("crypto");

// Return user's information given its id
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found" });
      else resolve({ id: row.id, username: row.email, name: row.name });
    });
  });
};

// Verify username and password at log-in
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve(false);
      else
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPassword)) resolve(false);
          else resolve({ id: row.id, username: row.email, name: row.name });
        });
    });
  });
};
