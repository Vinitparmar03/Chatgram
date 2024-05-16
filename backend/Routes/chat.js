import express from "express";
import { isAuthenticated } from "../Middleware/auth.js";
import {
  chatIdValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../Lib/validators.js";
import {
  deleteChat,
  friendProfile,
  getChatDetails,
  getMessages,
  sendAttachments,
} from "../Controllers/chat.js";
import { attachmentsMulter } from "../Middleware/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);

app.get("/friendprofile/:chatId", friendProfile);

app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

app.delete("/:id", chatIdValidator(), validateHandler, deleteChat);

app.get("/:id", chatIdValidator(), validateHandler, getChatDetails);

export default app;
