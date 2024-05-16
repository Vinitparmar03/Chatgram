import { compare } from "bcrypt";
import { TryCatch } from "../Middleware/error.js";
import { User } from "../Models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../Utils/features.js";
import { ErrorHandler } from "../Utils/utility.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../Constants/events.js";
import { Request } from "../Models/request.js";
import { Chat } from "../Models/chat.js";
import mongoose from "mongoose";

export const newUser = TryCatch(async (req, res, next) => {
  const { name, bio, email, password } = req.body;
  const file = req.file;

  const userExist = await User.findOne({ email });
  if (userExist) return next(new ErrorHandler("User already exist", 409));

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.create({
    name,
    bio,
    email,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created");
});

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("User not found", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

export const logout = TryCatch(async (req, res) => {
  console.log("logout...");
  return res
    .status(200)
    .cookie("chatgram-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

export const searchUser = TryCatch(async (req, res, next) => {
  const { name = "" } = req.query;

  const me = await User.findById(req.user);

  if (!me) return next(new ErrorHandler("User not found", 404));

  const friendIds = me.friends.map((friend) => friend.toString());

  const users = await User.find({
    _id: { $ne: req.user, $nin: friendIds },
    name: { $regex: name, $options: "i" },
  });

  return res.status(200).json({
    success: true,
    users,
  });
});

export const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  const user = await User.findById(userId);
  const me = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  const chat = await Chat.findOne({
    $or: [
      { name: `${user.name}-${me.name}` },
      { name: `${me.name}-${user.name}` },
    ],
  });

  if (chat) return next(new ErrorHandler("Chat already exists", 400));

  console.log(chat);

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

export const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    User.updateOne({ _id: members[0] }, { $push: { friends: members[1] } }),
    User.updateOne({ _id: members[1] }, { $push: { friends: members[0] } }),
  ]);

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

export const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

export const getMyFriends = TryCatch(async (req, res) => {
  const { name = "" } = req.query;
  console.log(name);
  const chats = await Chat.find({
    members: { $eq: req.user },
    name: { $regex: name, $options: "i" },
  }).populate("members", "name avatar");

  const transformedChats = chats.map(({ _id, members }) => {
    const otherMember = members.find(
      (member) => member._id.toString() !== req.user.toString()
    );

    return {
      _id,
      avatar: otherMember.avatar.url,
      name: otherMember.name,
      member: otherMember,
    };
  });

  return res.status(200).json({
    success: true,
    friends: transformedChats,
  });
});
