import { expect, it, vi } from "vitest";
import ButtonMenu from "../../components/ButtonMenu/ButtonMenu";
import ButtonMenuItem from "../../components/ButtonMenu/ButtonMenuItem";
import { renderWithProvider } from "../../testHelpers";

const handleClick = vi.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <ButtonMenu activeIndex={0} onItemClick={handleClick}>
      <ButtonMenuItem>Item 1</ButtonMenuItem>
      <ButtonMenuItem>Item 2</ButtonMenuItem>
    </ButtonMenu>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      background-color: var(--colors-tertiary);
      border: 1px solid var(--colors-disabled);
      border-radius: 16px;
      display: inline-flex;
      width: auto;
      align-items: center;
    }

    .c0>button,
    .c0>a {
      flex: auto;
    }

    .c0>button+button,
    .c0>a+a {
      margin-left: 2px;
    }

    .c0>button,
    .c0 a {
      box-shadow: none;
    }

    .c1 {
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

    .c1:focus-visible {
      outline: none;
      box-shadow: var(--shadows-focus);
    }

    .c1:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      transform: translateY(1px);
      box-shadow: none;
    }

    .c1:disabled,
    .c1.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c2 {
      background-color: transparent;
      color: var(--colors-primary);
    }

    .c2:hover:not(:disabled):not(:active) {
      background-color: transparent;
    }

    @media (hover: hover) {
      .c1:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
        opacity: 0.65;
      }
    }

    <div
        class="c0"
        variant="primary"
      >
        <button
          class="c1"
          scale="md"
          variant="primary"
        >
          Item 1
        </button>
        <button
          class="c1 c2"
          scale="md"
          variant="primary"
        >
          Item 2
        </button>
      </div>
    </DocumentFragment>
  `);
});
