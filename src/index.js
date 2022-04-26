// Anterior render
// import { render } from "react-dom";
// const app = document.getElementById("app");
// render(<App />, app);
// After
import App from "./App";

import { createRoot } from "react-dom/client";
const algo = document.getElementById("app");
const root = createRoot(algo);
root.render(<App />);
