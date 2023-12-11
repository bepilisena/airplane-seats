import { Container, ListGroup } from "react-bootstrap";

import "../styles/SeatsList.css";

const ReservedSeatsList = (props) => {
  const { reserved } = props;

  return (
    <>
      <Container className="seat-list">
        <h2>Reserved seats:</h2>
        <Container className="scroll-container list-group">
          <ListGroup>
            {/* Iterate over each element of "reserved" array and return a list item for each seat */}
            {reserved.map((seat) => (
              // Render a list item with a unique "key" attribute set to the "id" of the seat
              <ListGroup.Item key={seat.id}>
                <a
                  href={`#seat-${seat.row}-${seat.line}`}
                  className="list-group-item list-group-item-action disabled"
                >
                  <i className="bi-cart-check" />
                  <span className="seat-item">
                    {seat.row}-{seat.line}
                  </span>
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      </Container>
    </>
  );
};

export default ReservedSeatsList;
