import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { blueColor, whiteColor } from "../../Constants/color";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import { useNavigate } from "react-router-dom";

const ChatMessageHeader = ({ name, avatar, userTyping }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Stack
      height={"60px"}
      padding={"0 35px"}
      width={"100%"}
      direction={"row"}
      alignItems={"center"}
      bgcolor={whiteColor}
      gap={"16px"}
    >
      <Box
        position={"relative"}
        sx={{ cursor: "pointer" }}
        onClick={() => {
          handleBack();
        }}
      >
        <KeyboardArrowLeftOutlinedIcon
          sx={{
            cursor: "pointer",
            position: "absolute",
            color: "black",
            left: "-20px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Avatar src={avatar ? avatar.url : ""} />
      </Box>
      <Stack>
        <Typography color={"black"}>{name}</Typography>
        {userTyping && (
          <Typography color={blueColor} fontSize={"12px"}>
            typing...
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default ChatMessageHeader;
