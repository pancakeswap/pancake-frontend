import React from "react";
import noop from "lodash/noop";
import { renderWithTheme } from "../../testHelpers";
import { Modal } from "../../widgets/Modal";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(
    <Modal title="Title" onDismiss={noop}>
      body
    </Modal>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-gKsewC kzlzNR"
      >
        <div
          class="sc-iBPRYJ ieMkRo"
        >
          <div
            class="sc-dlfnbm sc-fubCfw fcyuqz kApDsK"
          >
            <h2
              class="sc-bdfBwQ sc-gsTCUz iEFWFe djGkFV"
              color="text"
            >
              Title
            </h2>
          </div>
          <button
            aria-label="Close the dialog"
            class="sc-eCssSg dHcAeg sc-jSgupP gPZlLR"
            type="button"
          >
            <svg
              class="sc-hKgILt SJlke"
              color="primary"
              viewBox="0 0 24 24"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"
              />
            </svg>
          </button>
        </div>
        <div
          class="sc-dlfnbm ggIFKV"
        >
          body
        </div>
      </div>
    </DocumentFragment>
  `);
});
