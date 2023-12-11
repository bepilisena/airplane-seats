"use strict";

const express = require("express");
const session = require("express-session");
const { check } = require("express-validator");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const userDao = require("./dao-users");
const seatsDao = require("./dao-seats");
const planesDao = require("./dao-planes");

// Port on wich the server is running
const PORT = 3001;

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Cross-Origin Resource Sharing setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Passport setup
passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password);
    if (!user) return callback(null, false, "Incorrect username or password");
    return callback(null, user);
  })
);

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  callback(null, user);
});

// Starting from data in the session extract the logged-in user
passport.deserializeUser((user, callback) => callback(null, user));

// Session middleware
app.use(
  session({
    secret: "super_duper#secret!passphrase",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

// Authentication verification middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not authorized" });
};

// Error handling middleware
const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};
app.use(handleError);

/****** Seats Routes ******/

// Get all seats corresponding to a plane_id
app.get("/api/seats/:plane_id", [check("plane_id").isInt({ min: 1, max: 3 })], async (req, res, next) => {
  try {
    const seats = await seatsDao.getAllSeats(req.params.plane_id);
    res.json(seats);
  } catch (err) {
    next(err);
  }
});

// Return the user_id associated to a seat_id
app.get("/api/check/:seat_id", isLoggedIn, [check("seat_id").isInt({ min: 1, max: 310 })], async (req, res, next) => {
  try {
    const result = await seatsDao.checkSeat(req.params.seat_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Put the reservation associate to a user_id
app.put("/api/reserve/", isLoggedIn, [check("seat_id").isInt({ min: 1, max: 310 })], async (req, res, next) => {
  try {
    await seatsDao.pushReservation(req.user.id, req.body.seat_id);
    res.json({});
  } catch (err) {
    next(err);
  }
});

// Delete the reservation associated to a user_id
app.delete("/api/delete/", isLoggedIn, [check("plane_id").isInt({ min: 1, max: 3 })], async (req, res, next) => {
  try {
    await seatsDao.deleteReservation(req.user.id, req.body.plane_id);
    res.json({});
  } catch (err) {
    next(err);
  }
});

/****** Planes Routes ******/

// Get all planes info
app.get("/api/planes", [check("plane_id").isInt({ min: 1, max: 3 })], async (req, res, next) => {
  try {
    const planeInfo = await planesDao.getAllPlanes();
    res.json(planeInfo);
  } catch (err) {
    next(err);
  }
});

/****** Users Routes ******/

// Login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info });
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

// Login status check
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) res.status(200).json(req.user);
  else res.status(401).json({ error: "Not authenticated" });
});

// Logout
app.delete("/api/sessions/current", (req, res) => req.logout(() => res.status(200).json({})));

// Activating the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
