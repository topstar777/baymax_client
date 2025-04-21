import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import MainLayout from "./components/MainLayout";
import NavBar from "./components/NavBar";
import LoginPage from "./components/LoginPage";
import "./App.css";

const CHAT_PORT = "general-chat";
const OPENAI_PORT = "ai-chat";
const SERVER_URL = "http://13.57.226.132:5001";

const VITE_CHAT_URL = `${SERVER_URL}/${CHAT_PORT}`;
const VITE_OPENAI_URL = `${SERVER_URL}/${OPENAI_PORT}`;

const socketChat = io(VITE_CHAT_URL);
const socketOpenAI = io(VITE_OPENAI_URL);

const App = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <NavBar toggleTheme={toggleTheme} />}
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage socket={socketChat} openAiSocket={socketOpenAI} />
          }
        />
        <Route
          path="/chat"
          element={
            <MainLayout socket={socketChat} openAiSocket={socketOpenAI} />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
