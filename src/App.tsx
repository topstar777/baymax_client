import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import MainLayout from "./components/MainLayout";
import NavBar from "./components/NavBar";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import "./App.css";

const CHAT_PORT = "general-chat";
const OPENAI_PORT = "ai-chat";
const VOICE_PORT = "voice-share";
const SERVER_URL = "https://baymax-backend-l2rs.onrender.com";

const VITE_CHAT_URL = `${SERVER_URL}/${CHAT_PORT}`;
const VITE_OPENAI_URL = `${SERVER_URL}/${OPENAI_PORT}`;
const VITE_VOICE_URL = `${SERVER_URL}/${VOICE_PORT}`;

const socketChat = io(VITE_CHAT_URL);
const socketOpenAI = io(VITE_OPENAI_URL);
const socketVoice = io(VITE_VOICE_URL);

const App = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup";

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
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/chat"
          element={
            <MainLayout
              socket={socketChat}
              openAiSocket={socketOpenAI}
              voiceSocket={socketVoice}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
