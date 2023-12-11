import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/FlightCard.css";

function FlightCard(props) {
  const { type, tot_seats, imgURL } = props;

  return (
    <>
      <div className="card shadow">
        <Container className="image-container">
          <img
            className="card-img"
            src={imgURL}
            alt="Card image"
          />
        </Container>
        <Container className="card-body">
          <h5 className="card-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h5>
          <p className="card-text">Total plane seats: {tot_seats}</p>
          <Link to={`/${type}`}>
            <Button variant="primary">See in details</Button>
          </Link>
        </Container>
      </div>
    </>
  );
}

export default FlightCard;
