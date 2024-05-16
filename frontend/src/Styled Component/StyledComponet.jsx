import { Skeleton, keyframes, styled } from "@mui/material";
import { grayChatColor, grayColor } from "../Constants/color";

export const InputField = styled("input")({
  width: "100%",
  border: "none",
  outline: "none",
  backgroundColor: grayChatColor,
  padding: "12px 12px 12px 40px",
  borderRadius: "20px",
  fontSize: "16px",
  "&::focus": {
    outline: "none",
  },
});

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

export const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));
