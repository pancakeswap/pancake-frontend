import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Toggle from "../../components/Toggle/Toggle";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Toggle checked onChange={handleChange} scale="md" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-dlfnbm jUupPG"
        scale="md"
      >
        <input
          checked=""
          class="sc-gsTCUz kVKCrS"
          scale="md"
          type="checkbox"
        />
        <div
          class="sc-bdfBwQ dtgDXM"
          scale="md"
        />
      </div>
    </DocumentFragment>
  `);
});

it("renders correctly scale sm", () => {
  const { asFragment } = renderWithTheme(<Toggle checked onChange={handleChange} scale="sm" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-dlfnbm iWurnU"
        scale="sm"
      >
        <input
          checked=""
          class="sc-gsTCUz fmfbFq"
          scale="sm"
          type="checkbox"
        />
        <div
          class="sc-bdfBwQ bvsyPw"
          scale="sm"
        />
      </div>
    </DocumentFragment>
  `);
});
