import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send"; // or your custom Icon

interface Props {
  socket: Socket;
  username: string;
  room: string;
}

interface Message {
  room: string;
  id: string | undefined;
  author: string;
  message: string;
  time: string;
}

const OneToOneChat = ({ socket, username, room }: Props) => {
  const theme = useTheme(); // 🎯 Access current theme
  const borderColor = theme.palette.mode === "dark" ? "#414141" : "#a3a3a3";

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const message: Message = {
        room,
        id: socket.id,
        author: username,
        message: currentMessage,
        time: timeString,
      };
      setMessageList((prev) => [...prev, message]);
      await socket.emit("send_message", message);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [currentMessage]);

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      console.log(data);
      if (data.author !== username) {
        setMessageList((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const bgColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  const otherUserBg = theme.palette.mode === "dark" ? "#444444" : "#bbbbbb";
  const myMessageBg = theme.palette.mode === "dark" ? "#222222" : "#dddddd";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: bgColor,
        color: textColor,
        p: 2,
        borderRadius: 1,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Chat
      </Typography>

      <Box
        className="custom-scrollbar"
        sx={{
          height: "63vh",
          border: `1px solid ${borderColor}`,
          borderRadius: 1.5,
          overflowY: "auto",
          p: 1,
          mb: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {messageList.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.id === socket.id ? "flex-start" : "flex-end",
            }}
          >
            <Box
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                width: "fit-content",
                maxWidth: "70%",
                bgcolor: message.id === socket.id ? myMessageBg : otherUserBg,
              }}
            >
              <Typography fontWeight="bold">{message.author}</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {message.message}
              </Typography>
              <Typography
                variant="caption"
                sx={{ textAlign: "right", display: "block", mt: 0.5 }}
              >
                {message.time}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          border: `1px solid ${borderColor}`,
          borderRadius: 1.5,
          p: 1,
        }}
      >
        <textarea
          ref={textareaRef}
          placeholder="Type here"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            background: "transparent",
            color: textColor,
            border: "none",
            outline: "none",
            resize: "none",
            fontSize: "1.3em",
          }}
        />
        <IconButton onClick={sendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default OneToOneChat;
