import { Stack } from "@mui/material";
import React from "react";
import ChatListHeader from "../Layout/ChatListHeader";
import ChatItem from "../Shared/ChatItem";

const ChatList = ({
  w,
  friends = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <>
      <ChatListHeader />
      <Stack width={w} direction="column" overflow="auto" maxHeight="100%">
        {friends?.map((data) => {
          const { avatar, _id, name, member } = data;

          const newMessageAlert = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );

          const isOnline = onlineUsers.includes(member._id.toString());

          return (
            <ChatItem
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })}
      </Stack>
    </>
  );
};

export default ChatList;
