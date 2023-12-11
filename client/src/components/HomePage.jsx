import { Container } from "react-bootstrap";

import FlightCard from "./FlightCard";

import "../styles/HomePage.css";

function HomePage(props) {
  const { planesInfo } = props;

  return (
    <>
      <Container className="cont justify-content-evenly">
        <Container className="cards justify-content-evenly">
          {planesInfo.map((plane) => (
            <FlightCard
              key={plane.id}
              id={plane.id}
              imgURL={
                plane.type === "local"
                  ? "./src/images/local.jpg"
                  : plane.type === "regional"
                  ? "./src/images/regional.jpg"
                  : "./src/images/international.jpg"
              }
              type={plane.type}
              tot_seats={plane.tot_seats}
            />
          ))}
        </Container>
      </Container>
    </>
  );
}

export default HomePage;
