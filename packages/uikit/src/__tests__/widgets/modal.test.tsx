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
      .c9 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: var(--colors-primary);
      color: var(--colors-primary);
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }

    .c5 {
      color: var(--colors-text);
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c7 {
      position: relative;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border: 0;
      border-radius: 16px;
      box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset;
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-letter-spacing: 0.03em;
      -moz-letter-spacing: 0.03em;
      -ms-letter-spacing: 0.03em;
      letter-spacing: 0.03em;
      line-height: 1;
      opacity: 1;
      outline: 0;
      -webkit-transition: background-color 0.2s,opacity 0.2s;
      transition: background-color 0.2s,opacity 0.2s;
      height: 48px;
      padding: 0 24px;
      background-color: transparent;
      color: var(--colors-primary);
      box-shadow: none;
    }

    .c7:focus-visible {
      outline: none;
      box-shadow: var(--shadows-focus);
    }

    .c7:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c7:disabled,
    .c7.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c8 {
      padding: 2px;
      width: 48px;
    }

    .c1 {
      border-radius: var(--radii-32px);
      overflow: hidden;
      min-width: 320px;
    }

    .c10 {
      padding: 24px;
    }

    .c3 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .c6 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.1;
    }

    .c2 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: transparent;
      border-bottom: 1px solid var(--colors-cardBorder);
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding: 12px 24px;
    }

    .c4 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }

    .c11 {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(90vh - 73px);
    }

    .c0 {
      overflow: hidden;
      background: var(--colors-backgroundAlt);
      box-shadow: 0px 20px 36px -8px rgba(14,14,44,0.1),0px 1px 1px rgba(0,0,0,0.05);
      border: 1px solid var(--colors-cardBorder);
      border-radius: 32px 32px 0px 0px;
      width: 100%;
      max-height: calc(var(--vh,1vh) * 100);
      z-index: 100;
      position: absolute;
      bottom: 0;
      max-width: none !important;
      min-height: 300px;
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c9 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    @media (hover:hover) {
      .c7:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
        opacity: 0.65;
      }
    }

    @media screen and (min-width:968px) {
      .c6 {
        font-size: 20px;
      }
    }

    @media screen and (min-width:852px) {
      .c2 {
        background: transparent;
      }
    }

    @media screen and (min-width:852px) {
      .c11 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        max-height: 90vh;
      }
    }

    @media screen and (min-width:852px) {
      .c0 {
        width: auto;
        position: auto;
        bottom: auto;
        border-radius: 32px;
        max-height: 100vh;
      }
    }

    <div
        class="c0"
        style="overflow: visible;"
      >
        <div
          class="c1"
          overflow="hidden"
        >
          <div
            class="c2"
          >
            <div
              class="c3 c4"
            >
              <h2
                class="c5 c6"
                color="text"
                font-size="16px"
              >
                Title
              </h2>
            </div>
            <button
              aria-label="Close the dialog"
              class="c7 c8"
              scale="md"
            >
              <svg
                class="c9"
                color="primary"
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
            class="c10 c3 c11"
            style="align-items: normal;"
          >
            body
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
