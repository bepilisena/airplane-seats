import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../styles/Navigation.css";

const Navigation = (props) => {
  const { loggedIn, logout } = props;

  const navigate = useNavigate();

  return (
    <>
      <Navbar
        bg="primary"
        expand="sm"
        variant="dark"
        fixed="top"
        className="navbar justify-content-between"
      >
        <Container className="justify-content-start">
          <Navbar.Brand>
            <i className="bi-airplane nav-icon" />
            Air Polito
          </Navbar.Brand>
        </Container>
        <Container className="justify-content-center">
          <Button
            variant="light"
            size="mg"
            className="nav-btn"
            onClick={() => navigate("/")}
          >
            Homepage
          </Button>
        </Container>
        <Container className="justify-content-end">
          <Nav className="ml-md-auto">
            {!loggedIn ? (
              <Button
                variant="outline-light"
                size="mg"
                className="nav-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline-light"
                size="mg"
                className="nav-btn"
                onClick={logout}
              >
                Logout
              </Button>
            )}
            <Navbar.Brand>
              <i className="bi-person-circle nav-icon" />
            </Navbar.Brand>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
