import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { blueColor, whiteColor } from "../../Constants/color";

const ChatItem = ({
  avatar,
  name,
  _id,
  isOnline,
  newMessageAlert,
  sameSender,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{
        padding: "0",
        width: "100%",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => {
        e.preventDefault();
        console.log(e, _id);
        handleDeleteChat(e, _id);
      }}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          backgroundColor: sameSender ? blueColor : "unset",
          color: sameSender ? whiteColor : "black",
          position: "relative",
          padding: "1rem",
          maxWidth: "100%",
        }}
      >
        <Avatar src={avatar} />
        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#00C73E",
              position: "absolute",
              top: "50%",
              right: "16px",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default ChatItem;
