import { Resizable } from "re-resizable";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import OneToOneChat from "./OneToOneChat";
import { Socket } from "socket.io-client";
import { useTheme } from "@mui/material/styles";

interface Props {
  socket: Socket;
  username: string;
  room: string;
  onClose: () => void;
}

const Sidebar = ({ socket, username, room, onClose }: Props) => {
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "#414141" : "#a3a3a3";

  return (
    <Resizable
      defaultSize={{ width: 700 }}
      enable={{ right: true }}
      style={{
        background: theme.palette.background.paper,
        borderRight: `1px solid ${borderColor}`,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Box p={2} display="flex" alignItems="center">
        <IconButton onClick={onClose}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Box p={2} flex={1} overflow="auto">
        <OneToOneChat socket={socket} username={username} room={room} />
      </Box>
    </Resizable>
  );
};

export default Sidebar;
