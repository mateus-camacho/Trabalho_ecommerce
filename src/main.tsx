import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from "./routes";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MainRoutes />
  </BrowserRouter>
);
