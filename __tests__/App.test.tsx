/**
 * @format
 */

import React from "react";
import "../global.css";
import { App } from "../src/app";

import ReactTestRenderer from "react-test-renderer";

test("renders correctly", async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
