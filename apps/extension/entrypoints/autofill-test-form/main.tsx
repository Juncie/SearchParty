import React from "react";
import ReactDOM from "react-dom/client";

import { AutofillTestFormPage } from "@/components/screens/AutofillTestFormPage";
import "../popup/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AutofillTestFormPage />
  </React.StrictMode>,
);
