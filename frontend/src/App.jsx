import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectRoute from "./Auth/ProtectRoute";
import { SocketProvider } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { lazy, useEffect } from "react";
import axios from "axios";
import { server } from "./Constants/config";
import { userExists, userNotExists } from "./Redux/reducers/auth";
import { LayoutLoader } from "./Components/Layout/Loaders";
import { Toaster } from "react-hot-toast";

const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/LoginSignup"));
const Chat = lazy(() => import("./Pages/Chat"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
      <Suspense fallback={<LayoutLoader />}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
