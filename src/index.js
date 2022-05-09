import App from "./App";

import { createRoot } from "react-dom/client";
const appHTML = document.getElementById("app");
const root = createRoot(appHTML);
root.render(<App />);
