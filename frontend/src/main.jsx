import React from "react";
import ReactDOM from "react-dom/client";
import routes from "./routes";
import { RouterProvider } from "react-router-dom";
import { Buffer } from "buffer";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";

window.Buffer = Buffer

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
  <RouterProvider router={routes} />
  </Provider>
);
