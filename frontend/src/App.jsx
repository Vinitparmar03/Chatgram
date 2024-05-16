import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectRoute from "./Auth/ProtectRoute";
import Home from "./Pages/Home";
import LoginSignup from "./Pages/LoginSignup";
import Chat from "./Pages/Chat";
import { SocketProvider } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "./Constants/config";
import { userExists, userNotExists } from "./Redux/reducers/auth";
import { LayoutLoader } from "./Components/Layout/Loaders";

function App() {
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);
  
  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectRoute user={!user} redirect="/">
              <LoginSignup />
            </ProtectRoute>
          }
        />

        <Route
          element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/chat/:chatId" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
