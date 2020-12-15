import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Input from "../../components/Input";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Input type="text" value="input" onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <input
        class="sc-bdfBwQ kgGQqk"
        scale="md"
        type="text"
        value="input"
      />
    </DocumentFragment>
  `);
});
