import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { BaseLayout, CardsLayout } from "../../components/Layouts";

it("renders base layout correctly", () => {
  const { asFragment } = renderWithTheme(<BaseLayout>basic layout</BaseLayout>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      display: grid;
      grid-template-columns: repeat(6,1fr);
      grid-gap: 16px;
    }

    @media screen and (min-width:576px) {
      .c0 {
        grid-template-columns: repeat(8,1fr);
        grid-gap: 24px;
      }
    }

    @media screen and (min-width:852px) {
      .c0 {
        grid-template-columns: repeat(12,1fr);
        grid-gap: 24px;
      }
    }

    @media screen and (min-width:968px) {
      .c0 {
        grid-template-columns: repeat(12,1fr);
        grid-gap: 32px;
      }
    }

    <div
        class="c0"
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
      .c0 {
      display: grid;
      grid-template-columns: repeat(6,1fr);
      grid-gap: 16px;
    }

    .c1 > div {
      grid-column: span 6;
    }

    @media screen and (min-width:576px) {
      .c0 {
        grid-template-columns: repeat(8,1fr);
        grid-gap: 24px;
      }
    }

    @media screen and (min-width:852px) {
      .c0 {
        grid-template-columns: repeat(12,1fr);
        grid-gap: 24px;
      }
    }

    @media screen and (min-width:968px) {
      .c0 {
        grid-template-columns: repeat(12,1fr);
        grid-gap: 32px;
      }
    }

    @media screen and (min-width:576px) {
      .c1 > div {
        grid-column: span 4;
      }
    }

    <div
        class="c0 c1"
      >
        cards layout
      </div>
    </DocumentFragment>
  `);
});
