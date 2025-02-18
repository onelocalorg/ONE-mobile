/**
 * @format
 */

import React from "react";
import ReactTestRenderer from "react-test-renderer";
import "../global.css";
import { App } from "../src/app";

test("renders correctly", async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
