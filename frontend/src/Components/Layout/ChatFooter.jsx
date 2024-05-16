import React, { useState } from "react";
import { AttachFile, Send } from "@mui/icons-material";
import { InputBox } from "../../Styled Component/StyledComponet";
import { IconButton, Stack } from "@mui/material";
import { orange } from "@mui/material/colors";
import { blueColor, darkBlueColor } from "../../Constants/color";
import FileMenu from "../Dialogs/FileMenu";

const ChatFooter = ({
  message,
  submitHandler,
  fileMenuAnchor,
  chatId,
  messageOnChange,
  handleFileOpen
}) => {
  return (
    <>
      <form
        style={{
          height: "40px",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"16px"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "20px",
              top: "5px",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFile />
          </IconButton>

          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
            sx={{
              padding: " 18px 10px",
              marginLeft: "40px",
              marginTop: "10px",
            }}
          />

          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: blueColor,
              color: "white",
              marginLeft: "10px",
              marginTop: "14px",
              padding: "0.5rem",
              height: "35px",
              width: "35px",
              "&:hover": {
                bgcolor: darkBlueColor,
              },
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default ChatFooter;
