import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Slide,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  openAiSocket: Socket;
}

const LoginPage = ({ socket, openAiSocket }: Props) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(true);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const baseUrl = "http://13.57.226.132:5001/api";

  const validate = () => {
    const newErrors: { email?: string; password?: string; roomName?: string } =
      {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Email is not valid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginUrl = `${baseUrl}/auth/client_login`;
      const response = await axios.post(loginUrl, {
        email,
        password,
      });
      if (response.status === 200) {
        // Assuming the backend returns a token or user data
        localStorage.setItem("token", response.data.token); // Store token (adjust based on backend response)
        setStep(2);
      } else {
        setError("Unexpected response from the server. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signupUrl = `${baseUrl}/auth/client_register`;
      const response = await axios.post(signupUrl, {
        name: "test",
        email,
        phone: "123-456-7894",
        linkedin: "https://www.linkedin.com/in/linkedinURL1/",
        password,
      });
      if (response.status === 200) {
        // Assuming the backend returns a token or user data
        localStorage.setItem("token", response.data.token); // Store token (adjust based on backend response)
        navigate("/main"); // Redirect to chat page
      } else {
        setError("Unexpected response from the server. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleRoomEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName) {
      setError("Room name is required.");
      return;
    }

    setError("");

    try {
      const checkRoomNameUrl = `${baseUrl}/check_room_name?name=${roomName}`;
      //const response = await axios.get(checkRoomNameUrl);

      // Optional: check response.data or response.status if needed
      navigate("/chat", { state: { email, roomName } });
      localStorage.setItem("username", email);
      localStorage.setItem("room", roomName);
      socket.emit("join_room", roomName);
      openAiSocket.emit("join_room", roomName);
    } catch (err: any) {
      console.error("Error checking room:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Server error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // vertically centers
        height: "100vh", // fill full viewport height
        backgroundColor: darkMode ? "#121212" : "#f5f5f5",
      }}
    >
      <Slide direction="left" in={step === 1} mountOnEnter unmountOnExit>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: darkMode ? "#121212" : "#f5f5f5",
          }}
        >
          <Box alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold" textAlign={"center"}>
              BayMax
            </Typography>
          </Box>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              width: 350,
              backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
              borderRadius: 3,
              boxShadow: darkMode
                ? "0 0 20px rgba(0,0,0,0.4)"
                : "0 0 20px rgba(0,0,0,0.1)",
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <Typography variant="subtitle1" mb={1}>
                Email
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 2, input: { color: darkMode ? "white" : "black" } }}
              />

              <Typography variant="subtitle1" mb={1}>
                Password
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 3, input: { color: darkMode ? "white" : "black" } }}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  background: "linear-gradient(to right, #2563eb, #3b82f6)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: 1.5,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(to right, #1e40af, #2563eb)",
                  },
                }}
              >
                Sign In
              </Button>
            </form>
          </Paper>
        </Box>
      </Slide>

      <Slide direction="right" in={step === 2} mountOnEnter unmountOnExit>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#121212",
          }}
        >
          <Box alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold" textAlign={"center"}>
              BayMax
            </Typography>
          </Box>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              width: 350,
              backgroundColor: "#1e1e1e",
              borderRadius: 3,
              boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              color: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Enter Room Name
            </Typography>
            <form onSubmit={handleRoomEntry}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{
                  mb: 3,
                  input: { color: "white" },
                  label: { color: "white" },
                }}
                InputLabelProps={{
                  style: { color: "#ccc" },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  background: "linear-gradient(to right, #2563eb, #3b82f6)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: 1.5,
                  py: 1.2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Join Room
              </Button>
            </form>
          </Paper>
        </Box>
      </Slide>
    </Box>
  );
};

export default LoginPage;
