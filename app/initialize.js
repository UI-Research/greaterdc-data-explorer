require('babel-polyfill');
import { h, render } from "preact";
import App from "./components/App";

import { RENDER_TARGET } from "./config";

document.addEventListener("DOMContentLoaded", () => {
  render(<App />, document.querySelector(RENDER_TARGET));
});
