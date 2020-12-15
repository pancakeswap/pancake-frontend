import React from "react";
import { renderWithTheme } from "../../testHelpers";
import ColorBox from "../../components/ColorBox";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<ColorBox>Color Box</ColorBox>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ gBXXpx"
      >
        Color Box
      </div>
    </DocumentFragment>
  `);
});
