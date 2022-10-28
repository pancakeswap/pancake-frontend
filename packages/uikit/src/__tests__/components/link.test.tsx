import React from "react";
import { renderWithProvider } from "../../testHelpers";
import { Link, LinkExternal } from "../../components/Link";

it("renders link correctly", () => {
  const { asFragment } = renderWithProvider(<Link href="https://pancakeswap.finance">Link</Link>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      color: var(--colors-primary);
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c1 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      width: fit-content;
    }

    .c1:hover {
      -webkit-text-decoration: underline;
      text-decoration: underline;
    }

    <a
        class="c0 c1"
        color="primary"
        font-size="16px"
        href="https://pancakeswap.finance"
      >
        Link
      </a>
    </DocumentFragment>
  `);
});

it("renders link external link correctly", () => {
  const { asFragment } = renderWithProvider(<LinkExternal href="https://pancakeswap.finance">Link</LinkExternal>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c2 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: var(--colors-primary);
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      margin-left: 4px;
    }

    .c0 {
      color: var(--colors-primary);
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c1 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      width: -webkit-fit-content;
      width: -moz-fit-content;
      width: fit-content;
    }

    .c1:hover {
      -webkit-text-decoration: underline;
      text-decoration: underline;
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c2 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    <a
        class="c0 c1"
        color="primary"
        font-size="16px"
        href="https://pancakeswap.finance"
        rel="noreferrer noopener"
        target="_blank"
      >
        Link
        <svg
          class="c2"
          color="primary"
          viewBox="0 0 24 24"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H11C11.55 5 12 4.55 12 4C12 3.45 11.55 3 11 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V13C21 12.45 20.55 12 20 12C19.45 12 19 12.45 19 13V18C19 18.55 18.55 19 18 19ZM14 4C14 4.55 14.45 5 15 5H17.59L8.46 14.13C8.07 14.52 8.07 15.15 8.46 15.54C8.85 15.93 9.48 15.93 9.87 15.54L19 6.41V9C19 9.55 19.45 10 20 10C20.55 10 21 9.55 21 9V4C21 3.45 20.55 3 20 3H15C14.45 3 14 3.45 14 4Z"
          />
        </svg>
      </a>
    </DocumentFragment>
  `);
});
