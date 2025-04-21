import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

import { Box, Typography, useTheme, Paper } from "@mui/material";

interface Props {
  socket: Socket; // socket is optional to avoid crash on undefined
}

interface Message {
  message: string;
  username: string;
  timestamp: string;
  type: "delta" | "done";
  response: string;
}

interface DisplayMessage {
  id: string;
  username: string;
  timestamp: string;
  response: string;
  isUser: boolean;
}

const Broadcast = ({ socket }: Props) => {
  const [messageList, setMessageList] = useState<DisplayMessage[]>([]);
  const theme = useTheme();
  const borderColor = theme.palette.mode === "dark" ? "#414141" : "#a3a3a3";

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (data: Message) => {
      const messageId = `${data.username}-${data.message}-${
        data.timestamp.split("T")[0]
      }`;

      setMessageList((prev) => {
        if (data.type === "delta") {
          const existingMessage = prev.find(
            (msg) => msg.id === messageId && !msg.isUser
          );
          if (existingMessage) {
            return prev.map((msg) =>
              msg.id === messageId && !msg.isUser
                ? { ...msg, response: msg.response + data.response }
                : msg
            );
          } else {
            return [
              ...prev,
              {
                id: `${messageId}-question`,
                username: data.username,
                timestamp: data.timestamp,
                response: data.message, // original question
                isUser: true, // You can make this `false` if needed
              },
              {
                id: messageId,
                username: data.username,
                timestamp: data.timestamp,
                response: data.response, // first delta
                isUser: false,
              },
            ];
          }
        } else if (data.type === "done") {
          return [
            ...prev.filter((msg) => msg.id !== messageId || msg.isUser),
            {
              id: messageId,
              username: data.username,
              timestamp: data.timestamp,
              response: data.response,
              isUser: false,
            },
          ];
        }
        return prev;
      });
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 1.5,
        overflowY: "auto",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" color="text.secondary" gutterBottom>
        Support
      </Typography>
      <Box
        className="custom-scrollbar"
        sx={{
          display: "flex",
          height: "80vh",
          border: `1px solid ${borderColor}`,
          borderRadius: 1.5,
          overflowY: "auto",
          p: 1,
          mb: 2,
          flexDirection: "column",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {messageList.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 1.5,
              maxWidth: "80%",
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${borderColor}`,
              alignSelf: msg.isUser ? "flex-end" : "flex-start",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {msg.username}
            </Typography>
            <Typography>{msg.response}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Broadcast;
