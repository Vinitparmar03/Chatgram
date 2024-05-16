import express from "express";
import {
  login,
  logout,
  newUser,
  searchUser,
  getMyProfile,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
} from "../Controllers/user.js";
import { singleAvatar } from "../Middleware/multer.js";
import { isAuthenticated } from "../Middleware/auth.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../Lib/validators.js";

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

app.use(isAuthenticated);

app.get("/logout", logout);
app.get("/me", getMyProfile);
app.get("/search", searchUser);

app.put(
  "/sendrequest",
  validateHandler,
  sendRequestValidator(),
  sendFriendRequest
);

app.put(
  "/acceptrequest",
  validateHandler,
  acceptRequestValidator(),
  acceptFriendRequest
);

app.get("/notifications", getMyNotifications);
app.get("/friends", getMyFriends);

export default app;
