import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatList from "../Specific/ChatList";
import { Drawer, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../../socket";
import { useMyFriendsQuery } from "../../Redux/api/api";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../Constants/events";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../Redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import { LayoutLoader } from "./Loaders";
import {
  setIsDeleteMenu,
  setSelectedDeleteChat,
} from "../../Redux/reducers/misc";
import DeleteChatMenu from "../Dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedContent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params?.chatId;
    const deleteMenuAnchor = useRef(null);

    const [isMobile, setIsMobile] = useState(true);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { setSearch } = useSelector((state) => state.misc);

    const { user } = useSelector((state) => state.auth);

    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } =
      useMyFriendsQuery(setSearch);

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => {
      setIsMobile(!isMobile);
    };

    useEffect(() => {
      if (chatId) {
        setIsMobile(false);
      }
    }, [params]);

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);
    return (
      <>
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />
        {isLoading ? (
          <LayoutLoader />
        ) : (
          <>
            <Drawer
              open={isMobile}
              onClose={handleMobileClose}
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              <ChatList
                w="100vw"
                friends={data?.friends}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            </Drawer>
            <Grid container height={"100vh"}>
              <Grid
                item
                md={4}
                sm={4.5}
                height={"100%"}
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              >
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <ChatList
                    w="100%"
                    friends={data?.friends}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlert={newMessagesAlert}
                    onlineUsers={onlineUsers}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={7.5} md={8} height={"100%"}>
                <WrappedContent {...props} chatId={chatId} user={user} />
              </Grid>
            </Grid>
          </>
        )}
      </>
    );
  };
};

export default AppLayout;
