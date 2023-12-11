import { Col, Container, Form, Button, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "../styles/LoginPage.css";

function LoginPage(props) {
  const { login } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    login(credentials)
      .then(() => navigate("/"))
      .catch((err) => {
        console.log(err);
        setShow(true);
      });
  };

  return (
    <>
      <Container className="main">
        <Row className="cont-row">
          <Col className="col-md-12 login-col">
            <i className="bi-box-arrow-in-right log-icon" />
            <header className="login-header">Please, insert your username and password</header>
            <Form
              className="input-box"
              onSubmit={handleSubmit}
            >
              <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger"
              >
                Username or password incorrect!
              </Alert>
              <Form.Group className="input-field">
                <Form.Control
                  type="text"
                  className="input"
                  id="email"
                  required={true}
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </Form.Group>
              <Form.Group className="input-field">
                <Form.Control
                  type="password"
                  className="input"
                  id="password"
                  required={true}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Form.Group>
              <Form.Group className="input-field">
                <Button
                  type="submit"
                  className="submit"
                >
                  Login
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginPage;
