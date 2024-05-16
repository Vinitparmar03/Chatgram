import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Avatar, Backdrop, Badge, Box, Stack } from "@mui/material";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blueColor, grayChatColor } from "../../Constants/color";
import { resetNotificationCount } from "../../Redux/reducers/chat";
import {
  setIsNotification,
  setIsSearch,
  setSearch,
} from "../../Redux/reducers/misc";
import { InputField } from "../../Styled Component/StyledComponet";
import Notifications from "../Specific/Notifications";
import Profile from "../Specific/Profile";
import Search from "../Specific/Search";

const SearchDialog = lazy(() => import("../Specific/Search"));
const NotifcationDialog = lazy(() => import("../Specific/Notifications"));

const ChatListHeader = () => {
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { isSearch, isNotification } = useSelector((state) => state.misc);

  const openSearch = () => dispatch(setIsSearch(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const toggleDrawer = () => {
    setOpenDrawer(true);
  };

  const { user } = useSelector((state) => state.auth);

  const { notificationCount } = useSelector((state) => state.chat);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      dispatch(setSearch(searchData));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchData]);

  return (
    <div
      style={{
        height: "100px",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        marginBottom={"10px"}
        padding={"0 10px"}
      >
        <Avatar
          src={user.avatar.url}
          sx={{ cursor: "pointer" }}
          onClick={toggleDrawer}
        />

        <Stack
          direction={"row"}
          gap={2}
          alignItems={"center"}
          cursor={"pointer"}
        >
          {notificationCount ? (
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon
                sx={{ color: blueColor, cursor: "pointer" }}
                onClick={() => {
                  openNotification();
                }}
              />
            </Badge>
          ) : (
            <NotificationsIcon
              sx={{ color: blueColor, cursor: "pointer" }}
              onClick={() => {
                openNotification();
              }}
            />
          )}
          <Box
            sx={{
              bgcolor: grayChatColor,
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "25px",
              color: blueColor,
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={openSearch}
          >
            +
          </Box>
        </Stack>
      </Stack>
      <Stack
        sx={{ width: "100%", borderRadius: "20px" }}
        direction={"row"}
        position={"relative"}
      >
        <SearchOutlinedIcon
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: "8px",
            color: "grey",
          }}
        />
        <InputField
          type="text"
          placeholder="Search"
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
      </Stack>

      <Profile
        name={user.name}
        avtar={user.avatar.url}
        bio={user.bio}
        email={user.email}
        createdAt={user.createdAt}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      />

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
    </div>
  );
};

export default ChatListHeader;
