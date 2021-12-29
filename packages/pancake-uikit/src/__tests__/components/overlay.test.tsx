import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { Overlay } from "../../components/Overlay";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Overlay />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: #280D5F99;
      z-index: 20;
    }

    <div
        class="c0"
        role="presentation"
      />
    </DocumentFragment>
  `);
});
