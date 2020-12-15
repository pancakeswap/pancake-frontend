import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { BaseLayout, CardsLayout } from "../../components/Layouts";

it("renders base layout correctly", () => {
  const { asFragment } = renderWithTheme(<BaseLayout>basic layout</BaseLayout>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ dvyXkL"
      >
        basic layout
      </div>
    </DocumentFragment>
  `);
});

it("renders card layout correctly", () => {
  const { asFragment } = renderWithTheme(<CardsLayout>cards layout</CardsLayout>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ sc-gsTCUz dvyXkL iqaxyV"
      >
        cards layout
      </div>
    </DocumentFragment>
  `);
});
