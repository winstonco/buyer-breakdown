/* @refresh reload */
import { render } from "solid-js/web";
import * as Scry from "scryfall-sdk";

import "./index.css";
import App from "./App";

Scry.setAgent("BuyerBreakdown", "1.0.0");

const root = document.getElementById("root");

render(() => <App />, root!);
