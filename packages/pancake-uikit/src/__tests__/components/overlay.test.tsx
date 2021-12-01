import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { Overlay } from "../../components/Overlay";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Overlay />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      z-index: 20;
    }

    .c1 {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: #280D5F99;
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
    }

    <div
        class="c0 c1"
        role="presentation"
      />
      ;
    </DocumentFragment>
  `);
});
