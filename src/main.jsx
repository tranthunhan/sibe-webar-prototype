import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// Academic mapping:
// [CO] The entry point does one thing: mount the experiment shell for predictable study access.
// [DF] Keeping bootstrapping minimal avoids adding non-experimental UI decisions.
// [ED] React StrictMode helps catch rough edges before participants encounter them.
// [PR] A static mount supports QR-launched mobile WebAR sessions without routing ceremony.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
