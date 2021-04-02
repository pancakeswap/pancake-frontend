import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Heading from "../../components/Heading/Heading";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Heading>Title</Heading>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <h2
        class="sc-bdvvaa sc-gsDJrp XbzBn ktrawH"
        color="text"
      >
        Title
      </h2>
    </DocumentFragment>
  `);
});
