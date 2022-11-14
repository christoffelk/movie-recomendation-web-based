import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Create from "./pages/create/create";
import Single from "./pages/single/Single";
import React from "react";
import { userInputs } from "./FormSource";
import MovieList from "./pages/list/MovieList";
import RatingList from "./pages/list/RatingList";

function setToken(adminToken) {
  sessionStorage.setItem("token", JSON.stringify(adminToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem("token");
  const adminToken = JSON.parse(tokenString);

  return adminToken?.token;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/">
            <Route path="dashboard" element={<Home />} />
            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
              <Route
                path="new"
                element={<Create  title="Add New User" />}
              />
            </Route>
            <Route path="rating">
              <Route index element={<RatingList />} />
              <Route path=":ratingId" element={<Single />} />
              <Route path="new" element={<Create />} />
            </Route>
          </Route>
          <Route path="movie">
            <Route index element={<MovieList />} />
            <Route path=":movieId" element={<Single />} />
            {/* <Route
              path="new"
              element={<Create title="Add New User" />}
            /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
