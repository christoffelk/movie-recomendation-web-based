import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Create from "./pages/create/create";
import Single from "./pages/single/Single";
import { userInputs } from "./FormSource";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="users">
              <Route index element={<List />} />
              <Route path=":userId" element={<Single />} />
              <Route
                path="new"
                element={<Create inputs={userInputs} title="Add New User" />}
              />
            </Route>
            <Route path="rating">
              <Route index element={<List />} />
              <Route path=":ratingId" element={<Single />} />
              <Route path="new" element={<Create />} />
            </Route>
          </Route>
          <Route path="movie">
            <Route index element={<List />} />
            <Route path=":movieId" element={<Single />} />
            <Route
              path="new"
              element={<Create inputs={userInputs} title="Add New User" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
