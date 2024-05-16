import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../Utils/utility.js";

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));
};

export const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("email", "Please Enter Username").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

export const loginValidator = () => [
  body("email", "Please Enter email").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

export const sendRequestValidator = () => [
  body("userId", "Please Enter User ID").notEmpty(),
];

export const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request ID").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];

export const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
];

export const chatIdValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
];
