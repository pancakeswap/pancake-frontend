import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Overlay from "../../components/Overlay/Overlay";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Overlay show />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdvvaa fdGbZD"
        role="presentation"
      />
    </DocumentFragment>
  `);
});
