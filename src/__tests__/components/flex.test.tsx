import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Flex from "../../components/Flex/Flex";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Flex>flex</Flex>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ iUGWfo"
      >
        flex
      </div>
    </DocumentFragment>
  `);
});
