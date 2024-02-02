import { expect, it } from "vitest";
import Button from "../../components/Button/Button";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Button>Submit</Button>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
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
      background-color: var(--colors-primary);
      color: var(--colors-invertedContrast);
    }

    .c0:focus-visible {
      outline: none;
      box-shadow: var(--shadows-focus);
    }

    .c0:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      transform: translateY(1px);
      box-shadow: none;
    }

    .c0:disabled,
    .c0.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    @media (hover: hover) {
      .c0:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
        opacity: 0.65;
      }
    }

    <button
        class="c0"
        scale="md"
        variant="primary"
      >
        Submit
      </button>
    </DocumentFragment>
  `);
});
