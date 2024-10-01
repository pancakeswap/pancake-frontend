import noop from "lodash/noop";
import { renderWithProvider } from "../../testHelpers";
import { Modal } from "../../widgets/Modal";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <Modal title="Title" onDismiss={noop}>
      body
    </Modal>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c10 {
      align-self: center;
      fill: var(--colors-textSubtle);
      color: var(--colors-textSubtle);
      flex-shrink: 0;
    }

    .c6 {
      color: var(--colors-text);
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c8 {
      position: relative;
      align-items: center;
      border: 0;
      border-radius: 16px;
      box-shadow: 0px -1px 0px 0px rgba(14, 14, 44, 0.4) inset;
      cursor: pointer;
      display: inline-flex;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      justify-content: center;
      letter-spacing: 0.03em;
      line-height: 1;
      opacity: 1;
      outline: 0;
      transition: background-color 0.2s,opacity 0.2s;
      height: 48px;
      padding: 0 24px;
      background-color: transparent;
      color: var(--colors-primary);
      box-shadow: none;
    }

    .c8:focus-visible {
      outline: none;
      box-shadow: var(--shadows-focus);
    }

    .c8:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      transform: translateY(1px);
      box-shadow: none;
    }

    .c8:disabled,
    .c8.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c9 {
      padding: 2px;
      width: 48px;
    }

    .c1 {
      border-radius: var(--radii-32px);
      overflow: hidden;
      min-width: 320px;
    }

    .c2 {
      background: transparent;
      padding: 12px 24px;
    }

    .c11 {
      position: relative;
      top: 0px;
      padding: 24px;
    }

    .c3 {
      display: flex;
    }

    .c4 {
      align-items: center;
      background: transparent;
      border-bottom: 1px solid var(--colors-cardBorder);
      display: flex;
      padding: 12px 24px;
    }

    .c5 {
      align-items: center;
      flex: 1;
    }

    .c12 {
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(90vh - 73px);
    }

    .c0 {
      overflow: hidden;
      background: var(--colors-backgroundAlt);
      box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1),0px 1px 1px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--colors-cardBorder);
      border-radius: 32px 32px 0px 0px;
      width: 100%;
      max-height: calc(var(--vh, 1vh) * 100);
      z-index: 100;
      position: absolute;
      bottom: 0;
      max-width: none!important;
      min-height: 300px;
    }

    .c7 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.1;
    }

    @supports (-webkit-text-size-adjust: none) and (not (-ms-accelerator: true)) and (not (-moz-appearance: none)) {
      .c10 {
        filter: none!important;
      }
    }

    @media (hover: hover) {
      .c8:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
        opacity: 0.65;
      }
    }

    @media screen and (min-width: 852px) {
      .c4 {
        background: transparent;
      }
    }

    @media screen and (min-width: 852px) {
      .c12 {
        display: flex;
        max-height: 90vh;
      }
    }

    @media screen and (min-width: 852px) {
      .c0 {
        width: auto;
        position: auto;
        bottom: auto;
        border-radius: 32px;
        max-height: 100vh;
      }
    }

    @media screen and (min-width: 968px) {
      .c7 {
        font-size: 20px;
      }
    }

    <div
        class="c0"
        style="overflow: visible;"
      >
        <div
          class="c1"
        >
          <div
            class="c2 c3 c4"
          >
            <div
              class="c3 c5"
            >
              <h2
                class="c6 c7"
              >
                Title
              </h2>
            </div>
            <button
              aria-label="Close the dialog"
              class="c8 c9"
              scale="md"
              variant="text"
            >
              <svg
                class="c10"
                color="textSubtle"
                viewBox="0 0 24 24"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div
            class="c11 c3 c12"
            style="align-items: normal;"
          >
            body
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
