"use strict";

const db = require("./db");

// Return all seats corresponding to a plane_id
exports.getAllSeats = (plane_id) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM seats WHERE plane_id = ?", [plane_id], (err, rows) => {
      if (err) reject(err);
      resolve(rows.map((e) => e));
    });
  });
};

// Set the user_id associated to a seat_id
exports.pushReservation = (user_id, seat_id) => {
  const sql = "UPDATE seats SET user_id = ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [user_id, seat_id], (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

// Set the user_id associated to all seats of a plane to NULL
exports.deleteReservation = (user_id, plane_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE seats SET user_id = NULL WHERE user_id = ? AND plane_id = ?",
      [user_id, plane_id],
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// Return the user_id associated to a seat_id
exports.checkSeat = (seat_id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT user_id FROM seats WHERE id = ?", [seat_id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};
