import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeContextProvider } from "./contexts";
import { Popup } from "./components";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <Popup />
    </ThemeContextProvider>
  </React.StrictMode>
);
