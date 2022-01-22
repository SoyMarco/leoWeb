import { render } from "react-dom";
import App from "./App.jsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

render(<App />, document.getElementById("root"));

serviceWorkerRegistration.register();
