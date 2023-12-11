import { Button, Form, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useState } from "react";

import "../styles/Sidebar.css";

function Sidebar(props) {
  const {
    loggedIn,
    totSeats,
    occupiedSeats,
    availableSeats,
    reservedSeats,
    loading,
    reserveButton,
    isBooked,
    handleConfirm,
    handleRandom,
    handleCancel,
    handleDelete,
  } = props;

  const [numSeats, setNumSeats] = useState("");

  return (
    <>
      <Row className="cont-sidebar">
        <Col className="below-nav left-sidebar">
          <h1 className="sidebar-title">Seats</h1>

          {/* Seats avilability legend */}

          <h2 className="sidebar-seats">Total seats: {totSeats}</h2>
          <Container className="legend-cont d-flex flex-column">
            <span className="legend">
              <Button
                variant="dark"
                className="seat-legend available custom-button"
                disabled={true}
              />
              <span className="seat-type">
                Available:{" "}
                {loading ? (
                  <Spinner
                    className="spinner-legend"
                    animation="border"
                    variant="dark"
                    size="sm"
                  />
                ) : (
                  availableSeats
                )}
                /{totSeats}
              </span>
            </span>
            <span className="legend">
              <Button
                variant="dark"
                className="seat-legend occupied custom-button"
                disabled={true}
              />
              <span className="seat-type">
                Occupied: {occupiedSeats}/{totSeats}
              </span>
            </span>
            <span className="legend">
              <Button
                variant="dark"
                className="seat-legend reserved custom-button"
                disabled={true}
              />
              <span className="seat-type">
                Reserved: {reservedSeats || 0}/{totSeats}
              </span>
            </span>
          </Container>

          <section className="separator" />

          {/* Reservation form */}

          {loggedIn && isBooked ? (
            // Delete button - show if user is logged-in and has already booked some seats
            <Container className="already-booked container">
              <p>You already booked some seats</p>
              <p>Do you want to cancel your booking?</p>
              <Button
                variant="danger"
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
            </Container>
          ) : loggedIn ? (
            occupiedSeats === totSeats ? (
              // No available seats - show if user is logged-in and all seats are occupied
              <Container className="log-container">
                <Alert variant="danger">There are no available seats</Alert>
              </Container>
            ) : (
              <>
                {/* Random seats reservation */}
                <Container className="reservation-form">
                  <h1>Book your seats</h1>
                  <Form
                    onSubmit={(ev) => {
                      ev.preventDefault();
                      handleRandom(numSeats);
                      setNumSeats("");
                    }}
                  >
                    <Container className="form-row">
                      <Form.Group
                        controlId="formNumSeats"
                        className="form-group"
                      >
                        <Form.Label className="form-label">Number of seats</Form.Label>
                        <Form.Control
                          type="number"
                          value={numSeats}
                          required={true}
                          min="1"
                          max={availableSeats}
                          onChange={(ev) => setNumSeats(ev.target.value)}
                        />
                      </Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={reserveButton}
                      >
                        Reserve
                      </Button>
                    </Container>
                  </Form>
                </Container>
                <Container className="conf-container">
                  <h2>Do you want to confirm your reservation?</h2>
                  <Button
                    className="conf-button"
                    variant="success"
                    onClick={() => {
                      if (reservedSeats > 0) handleConfirm();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    className="conf-button"
                    variant="danger"
                    onClick={() => {
                      if (reservedSeats > 0) handleCancel();
                    }}
                  >
                    Cancel
                  </Button>
                </Container>
              </>
            )
          ) : (
            // Not logged-in - show if user is not logged-in
            <Container className="log-container">
              <Alert variant="warning">You are not logged in</Alert>
            </Container>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Sidebar;
