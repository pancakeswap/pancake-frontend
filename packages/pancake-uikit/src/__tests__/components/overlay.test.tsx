import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Overlay from "../../components/Overlay/Overlay";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Overlay show />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: #452a7a;
      -webkit-transition: opacity 0.4s;
      transition: opacity 0.4s;
      opacity: 0.6;
      z-index: 10;
      pointer-events: initial;
    }

    <div
        class="c0"
        role="presentation"
      />
    </DocumentFragment>
  `);
});
