import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Breadcrumbs>Link</Breadcrumbs>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <ul
        class="sc-dlfnbm lhEQuh"
      />
    </DocumentFragment>
  `);
});
