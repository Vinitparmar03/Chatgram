import { CalendarMonth, Face } from "@mui/icons-material";
import { Avatar, Drawer, IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { blueColor, darkBlueColor } from "../../Constants/color";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../Redux/reducers/auth";
import { server } from "../../Constants/config";

const Profile = ({
  openDrawer,
  avtar,
  bio,
  name,
  email,
  createdAt,
  setOpenDrawer,
}) => {
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      console.log(data);

      if (data.success) {
        dispatch(userNotExists());
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
      <IconButton
        sx={{
          cursor: "pointer",
          position: "absolute",
          top: "20px",
          left: "20px",
          bgcolor: blueColor,

          "&:hover": {
            bgcolor: darkBlueColor,
          },
        }}
        onClick={() => setOpenDrawer(false)}
      >
        <ArrowBackIcon fontSize="medium" />
      </IconButton>
      <Stack
        direction={"column"}
        sx={{
          padding: "30px 0 0",
          width: "330px",
          bgcolor: "gray",
          height: "100%",
        }}
        alignItems={"center"}
      >
        <Avatar
          src={avtar}
          sx={{
            width: 200,
            height: 200,
            objectFit: "contain",
            marginBottom: "1rem",
            border: "5px solid white",
          }}
        />
        <ProfileCard heading={"Bio"} text={bio} />
        <ProfileCard
          heading={"Email"}
          text={email}
          Icon={<EmailIcon sx={{ marginRight: "10px" }} />}
        />
        <ProfileCard
          heading={"Name"}
          text={name}
          Icon={<Face sx={{ marginRight: "16px" }} />}
        />
        <ProfileCard
          heading={"Joined"}
          text={moment(createdAt).fromNow()}
          Icon={<CalendarMonth sx={{ marginRight: "10px" }} />}
        />
        <IconButton
          sx={{
            marginTop: "10px",
            backgroundColor: "#D61A1A",
            width: "200px",
            borderRadius: "10px",

            "&:hover": {
              bgcolor: "#9D0D0D",
            },
          }}
          onClick={logoutHandler}
        >
          <LogoutIcon sx={{ color: "white" }} />
        </IconButton>
      </Stack>
    </Drawer>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    color={"white"}
    textAlign={"center"}
    sx={{ marginBottom: "16px", marginRight: Icon && "25px" }}
  >
    {Icon && Icon}

    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"black"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
