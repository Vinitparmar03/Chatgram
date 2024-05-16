import { Stack } from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppLayout from "../Components/Layout/AppLayout";
import ChatFooter from "../Components/Layout/ChatFooter";
import ChatMessageHeader from "../Components/Layout/ChatMessageHeader";
import { Skeletons } from "../Components/Layout/Loaders";
import MessageComponent from "../Components/Shared/MessageComponent";
import { grayColor } from "../Constants/color";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../Constants/events";
import {
  useChatDetailsQuery,
  useFriendProfileQuery,
  useGetMessagesQuery,
} from "../Redux/api/api";
import { removeNewMessagesAlert } from "../Redux/reducers/chat";
import { setIsFileMenu } from "../Redux/reducers/misc";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { getSocket } from "../socket";

const Chat = ({ chatId, user }) => {
  const { data } = useFriendProfileQuery({ chatId });
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const getMessages = useGetMessagesQuery({ chatId });

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: getMessages.isError, error: getMessages.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [500]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    console.log(members);

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    console.log("Chat", chatId);
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      console.log(data.chatId !== chatId);
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  useErrors(errors);

  const allMessages = getMessages.isLoading
    ? []
    : [...getMessages?.data?.messages, ...messages];

  return getMessages.isLoading ? (
    <Skeletons />
  ) : (
    <Fragment>
      <ChatMessageHeader
        name={data?.friend?.name}
        avatar={data?.friend?.avatar}
        userTyping={userTyping}
      />
      <Stack
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"calc(100vh - 60px - 52px)"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i, index) => (
          <MessageComponent key={index} message={i} user={user} />
        ))}

        <div ref={bottomRef} />
      </Stack>

      <ChatFooter
        message={message}
        setMessage={setMessage}
        submitHandler={submitHandler}
        fileMenuAnchor={fileMenuAnchor}
        chatId={chatId}
        messageOnChange={messageOnChange}
        handleFileOpen={handleFileOpen}
      />
    </Fragment>
  );
};

export default AppLayout()(Chat);
