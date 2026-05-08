import React from "react";
import ReactDOM from "react-dom/client";
import { SearchPartyPanel } from "@/components/SearchPartyPanel";
import "./style.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <SearchPartyPanel surface="popup" />
  </React.StrictMode>
);
