import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Checkbox from "../../components/Checkbox/Checkbox";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Checkbox checked onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <input
        checked=""
        class="sc-bdvvaa gvNXrl"
        scale="md"
        type="checkbox"
      />
    </DocumentFragment>
  `);
});
