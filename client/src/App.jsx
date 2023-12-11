import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useState, useEffect } from "react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PlaneView from "./components/PlaneView";
import Navigation from "./components/Navigation";

import API from "./API";

function App() {
  const [planesInfo, setPlanesInfo] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Run only when the component is rendered for the first time
  useEffect(() => {
    const init = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      }
    };
    init();
  }, []);

  // When the user changes, fetch planes info
  useEffect(() => {
    API.getAllPlanes()
      .then((planeInfo) => setPlanesInfo(planeInfo))
      .catch((err) => console.error("Error fetching plane info: ", err));
  }, [user]);

  // Handle login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await API.logOut();
      setUser(null);
      setLoggedIn(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <BrowserRouter>
        <Navigation
          loggedIn={loggedIn}
          logout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={<HomePage planesInfo={planesInfo} />}
          />
          <Route
            path="/login"
            element={
              !loggedIn ? (
                <LoginPage login={handleLogin} />
              ) : (
                <Navigate
                  replace
                  to="/"
                />
              )
            }
          />
          {/* Flight card */}
          {planesInfo.map((planeInfo) => (
            <Route
              key={planeInfo.id}
              path={`/${planeInfo.type.toLowerCase()}`}
              element={
                <PlaneView
                  loggedIn={loggedIn}
                  plane_id={planeInfo.id}
                  seatsPerRow={planeInfo.seats_per_row}
                  totSeats={planeInfo.tot_seats}
                  user_id={loggedIn ? user.id : null}
                />
              }
            />
          ))}
          <Route
            path="*"
            element={
              <Navigate
                replace
                to="/"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
