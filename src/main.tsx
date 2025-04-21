import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "./theme";
import { useState } from "react";
import "@fontsource/inter";

const Root = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <BrowserRouter>
          <App toggleTheme={toggleTheme} />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
