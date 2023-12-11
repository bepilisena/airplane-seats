import { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";

import Sidebar from "./Sidebar";
import SeatsList from "./SeatsList";

import API from "../API";

import "../styles/PlaneView.css";

function PlaneView(props) {
  const { loggedIn, plane_id, seatsPerRow, totSeats, user_id } = props;

  const [seats, setSeats] = useState([]);
  const [reservation, setReservation] = useState([]);
  const [selected, setSelected] = useState(false); // Used to specify if a seat has been selected
  const [reserveButton, setReserveButton] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [dirty, setDirty] = useState(false); // Used to specify if seats have to be reloaded
  const [isBooked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // Get all seats
  useEffect(() => {
    API.getAllSeats(plane_id)
      .then((seats) => {
        setSelected(true);
        const newMatrix = []; // Initialize a new matrix to store seats
        let row = []; // Initialize a new row to store seats per row
        seats.forEach((seat) => {
          // Push a new seat object with variant "danger" if user_id is truthy, otherwise "primary"
          row.push({ ...seat, variant: seat.user_id ? "danger" : "primary" });
          // If the row is full push it into newMatrix and reset the row
          if (row.length >= seatsPerRow) {
            newMatrix.push(row);
            row = [];
          }
        });
        newMatrix.push(row); // Push the remaining seats in the last row to the newMatrix
        setSeats(newMatrix);
        setDirty(false);
        if (user_id) {
          // Check if any of the seats in newMatrix are booked by the current user
          setBooked(newMatrix.flat().filter((seat) => seat.user_id === user_id).length > 0 ? true : false);
        }
        setSelected(false);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [seatsPerRow, plane_id, dirty, user_id]);

  // Update the available seats count
  useEffect(() => {
    // Calculate the count of available seats by filtering seats with "null" user_id
    const availableSeatsCount = seats.flat().filter((s) => s.user_id === null).length;
    setAvailableSeats(Math.max(availableSeatsCount - reservation.length, 0));
  }, [reservation.length, seats]);

  // Assign random seats according to numSeats
  function handleRandom(numSeats) {
    let reservation = [];
    while (reservation.length < numSeats) {
      // Filter all seats with "null" user_id
      const filteredSeats = seats.flat().filter((seat) => seat.user_id === null);
      // Pick a random seat from filteredSeats array and add it to the reservation if not already included
      const pickedSeat = filteredSeats[Math.floor(Math.random() * availableSeats)];
      if (!reservation.includes(pickedSeat)) reservation.push(pickedSeat);
    }
    setReservation(reservation); // Set the reservation state with randomly selected seats
    setSelected(true); // Set the selected flag to true
    setReserveButton(true); // Set the reserveButton flag to true
  }

  // Handle seat selection
  const handleSeatSelect = (id) => {
    setSeats((prevSeats) => {
      // Update the seats state using the previous seats state
      const newSeats = prevSeats.map((row) =>
        row.map((seat) => {
          if (seat.id === id) {
            // If the seat id matches the selected id, toggle its variant between "primary" and "warning"
            return { ...seat, variant: seat.variant === "primary" ? "warning" : "primary" };
          }
          return seat;
        })
      );
      const reservedSeats = newSeats.flat().filter((seat) => seat.variant === "warning");
      setReservation(reservedSeats);
      // Update the reserveButton state based on whether there are any reserved seats
      setReserveButton(reservedSeats.length > 0);
      return newSeats;
    });
  };

  // Handle confirmation of reserved seats
  async function handleConfirm() {
    setSelected(true);
    setLoading(true);
    // Array of promises
    const checkSeatPromises = reservation.map(async (seat) => {
      try {
        const check = await API.checkSeat(seat.id);
        if (check.user_id !== null) {
          // If the seat is already reserved, update its variant to "outline-warning"
          setSeats((oldSeats) =>
            oldSeats.map((row) => row.map((s) => (s.id === seat.id ? { ...s, variant: "outline-warning" } : s)))
          );
          return true;
        }
      } catch (err) {
        console.log(err);
      }
      return false;
    });
    try {
      const results = await Promise.all(checkSeatPromises);
      if (results.includes(true)) {
        setShow(true);
        setTimeout(() => {
          setShow(false);
          setDirty(true);
          setReservation([]);
        }, 5000);
      } else {
        // All seats are available, reserve them
        await Promise.all(reservation.map((seat) => API.reserveSeat(seat.id).catch((err) => console.log(err))));
        setDirty(true);
        setReservation([]);
      }
    } catch (err) {
      console.log(err);
      setDirty(true);
      setReservation([]);
    }
    setReserveButton(false);
  }

  // Handle deletion of booking
  function handleDelete() {
    API.deleteReservation(plane_id)
      .then(() => {
        setDirty(true);
        setSelected(false);
      })
      .catch((err) => console.log(err));
  }

  // Handle cancellation of reservation
  function handleCancel() {
    // Make all reserved seats available again
    setSeats((prevSeats) =>
      prevSeats.map((row) =>
        row.map((seat) => ({
          ...seat,
          variant: seat.variant === "warning" ? "primary" : seat.variant,
        }))
      )
    );
    setReservation([]);
    setSelected(false);
    setReserveButton(false);
  }

  return (
    <>
      <Sidebar
        loggedIn={loggedIn}
        totSeats={totSeats}
        occupiedSeats={seats.flat().filter((seat) => seat.user_id !== null).length}
        availableSeats={availableSeats}
        reservedSeats={reservation.length}
        loading={loading}
        reserveButton={reserveButton}
        isBooked={isBooked}
        handleConfirm={handleConfirm}
        handleRandom={handleRandom}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
      />

      {/* Airplane view */}

      <Container className="main-cont">
        <Container className="seats-grid">
          <Container className="plane-border">
            {/* Container for seats conflict alert and loading indicator */}
            <Container className="loading-cont">
              {show ? (
                <Alert variant="danger abort-alert">
                  <span>Your booking has been deleted. One or more seats you selected have been already occupied</span>
                </Alert>
              ) : (
                loading && <Spinner className="spinner-border" />
              )}
            </Container>

            {/* Plane type */}

            <span className="plane-title">
              {plane_id === 1 ? "Local" : plane_id === 2 ? "Regional" : "International"} plane
            </span>

            {/* Container for the seats */}

            <Container className="grid-box">
              <Container className="line-row">
                {/* Mapping each letter a line */}
                {["A", "B", "C", "D", "E", "F"].slice(0, seatsPerRow).map((line, index) => (
                  <Container
                    className="line"
                    key={index}
                  >
                    <span>{line}</span>
                  </Container>
                ))}
              </Container>

              {/* Seats grid */}

              {seats.map((row, rowIndex) => (
                <Container
                  className="seat-row"
                  key={rowIndex}
                >
                  {/* For each row, iterate over each seat in the current row */}
                  {row.map((seat) => (
                    <Button
                      variant={seat.variant}
                      className="seat"
                      key={`${seat.id}`}
                      onClick={() => handleSeatSelect(seat.id)}
                      disabled={!loggedIn || isBooked || selected || seat.user_id}
                    >
                      {`${seat.row}-${seat.line}`}
                    </Button>
                  ))}
                </Container>
              ))}
            </Container>
          </Container>
          {loggedIn && <SeatsList reserved={reservation} />}
        </Container>
      </Container>
    </>
  );
}

export default PlaneView;
