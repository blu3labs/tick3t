import React from "react";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { RouterProvider } from "react-router-dom";
import "./index.css";
// import { Buffer } from "buffer";

// window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={routes} />
);
