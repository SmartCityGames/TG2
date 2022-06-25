import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./components/router";
import UserAuthProvider from "./context/auth/provider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAuthProvider>
        <Router />
      </UserAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
