import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Tag from "../../components/Tag/Tag";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Tag>Core</Tag>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ cVEdKv"
      >
        Core
      </div>
    </DocumentFragment>
  `);
});
