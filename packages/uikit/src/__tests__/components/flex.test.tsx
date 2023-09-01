import React from "react";
import { renderWithProvider } from "../../testHelpers";
import Flex from "../../components/Box/Flex";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Flex>flex</Flex>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      display: flex;
    }

    <div
        class="c0"
      >
        flex
      </div>
    </DocumentFragment>
  `);
});
