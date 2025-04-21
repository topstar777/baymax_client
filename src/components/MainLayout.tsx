// components/MainLayout.tsx
import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import Broadcast from "./Broadcast";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  openAiSocket: Socket;
}

const MainLayout = ({ socket, openAiSocket }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  let savedUsername = localStorage.getItem("username") || "";
  let savedRoom = localStorage.getItem("room") || "";

  useEffect(() => {
    savedUsername = localStorage.getItem("username") || "";
    savedRoom = localStorage.getItem("room") || "";

    if (savedUsername && savedRoom) {
      socket.emit("join_room", savedRoom);
      openAiSocket.emit("join_room", savedRoom);
    }
  }, [socket, openAiSocket]);

  return (
    <Box display="flex">
      {sidebarOpen && (
        <Sidebar
          socket={socket}
          username={savedUsername}
          room={savedRoom}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <Box flex={1} p={2} position="relative">
        {!sidebarOpen && (
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{ position: "absolute", top: 16, left: 16, zIndex: 1000 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        {!sidebarOpen ? (
          <Box marginLeft={6}>
            <Broadcast socket={openAiSocket} />
          </Box>
        ) : (
          <Broadcast socket={openAiSocket} />
        )}
      </Box>
    </Box>
  );
};

export default MainLayout;
