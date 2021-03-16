import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { Alert } from "../../components/Alert";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Alert title="Alert title">Description</Alert>);

  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-eCssSg sc-jSgupP sc-pFZIQ jnvqfy cjuMmG iHQmOP"
      >
        <div
          class="sc-gKsewC fosoJN"
        >
          <svg
            class="sc-bdfBwQ gcQKnf"
            color="currentColor"
            viewBox="0 0 24 24"
            width="24px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 7H13V9H11V7ZM12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
            />
          </svg>
        </div>
        <div
          class="sc-iBPRYJ hdYjNd"
        >
          <div
            class="sc-gsTCUz TrMyr"
            color="text"
          >
            Alert title
          </div>
          <p
            class="sc-gsTCUz fgiAxh"
            color="text"
          >
            Description
          </p>
        </div>
      </div>
    </DocumentFragment>
  `);
});
