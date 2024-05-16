import jwt from "jsonwebtoken";
import { ErrorHandler } from "../Utils/utility.js";
import { CHATGRAM_TOKEN } from "../Constants/config.js";
import { TryCatch } from "./error.js";
import { User } from "../Models/user.js";

export const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies[CHATGRAM_TOKEN];

  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});

export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[CHATGRAM_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};
