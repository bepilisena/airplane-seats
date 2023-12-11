"use strict";

const SERVER_URL = "http://localhost:3001/api/";

/****** Seats APIs ******/

// Getting from the server all the seats of a plane
const getAllSeats = async (plane_id) => {
  return getJson(fetch(`${SERVER_URL}seats/${plane_id}`)).then((json) => {
    return json.map((seat) => {
      return {
        id: seat.id,
        row: seat.row,
        line: seat.line,
        plane_id: seat.plane_id,
        user_id: seat.user_id,
      };
    });
  });
};

// Take a seat_id and return the user_id associated with that seat
const checkSeat = async (seat_id) => {
  return getJson(fetch(`${SERVER_URL}check/${seat_id}`, { credentials: "include" })).then((seat) => {
    return { user_id: seat.user_id };
  });
};

// Take a seat_id and set the user_id to the one corresponding to the logged-in user 
const reserveSeat = async (seat_id) => {
  return getJson(
    fetch(`${SERVER_URL}reserve/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        seat_id: seat_id,
      }),
    })
  );
};

// Take a plane_id and set the user_id of all the seats of that plane to NULL
const deleteReservation = async (plane_id) => {
  return getJson(
    fetch(`${SERVER_URL}delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        plane_id: plane_id,
      }),
    })
  );
};

/****** Planes APIs ******/

// Getting from the server all the planes
const getAllPlanes = async () => {
  return getJson(fetch(`${SERVER_URL}planes`)).then((json) => {
    return json.map((plane) => {
      return {
        id: plane.id,
        type: plane.type,
        rows: plane.rows,
        seats_per_row: plane.seats_per_row,
        tot_seats: plane.tot_seats,
      };
    });
  });
};

/****** Users APIs ******/

// Execute log-in using username and password inside "credentials" object
const logIn = async (credentials) => {
  return getJson(
    fetch(`${SERVER_URL}sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    })
  );
};

// Verify if user is still logged-in
const getUserInfo = async () => {
  return getJson(
    fetch(`${SERVER_URL}sessions/current`, {
      credentials: "include",
    })
  );
};

// Execute log-out destroying the session
const logOut = async () => {
  return getJson(
    fetch(`${SERVER_URL}sessions/current`, {
      method: "DELETE",
      credentials: "include",
    })
  );
};

/****** Utilities ******/

// Parse the HTTP response
const getJson = (httpResponsePromise) =>
  new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        response
          .json()
          .then((json) => {
            if (response.ok) resolve(json);
            else reject(json);
          })
          .catch((err) => reject({ error: "Cannot parse server response: " + err }));
      })
      .catch((err) => reject({ error: "Cannot communicate: " + err }));
  });

const API = {
  logIn,
  getUserInfo,
  logOut,
  getAllSeats,
  getAllPlanes,
  reserveSeat,
  deleteReservation,
  checkSeat,
};

export default API;
