import { expect, it, vi } from "vitest";
import Toggle from "../../components/Toggle/Toggle";
import { renderWithProvider } from "../../testHelpers";

const handleChange = vi.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Toggle checked onChange={handleChange} scale="md" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c3 {
      background-color: var(--colors-backgroundAlt);
      border-radius: 50%;
      cursor: pointer;
      height: 26px;
      left: 3px;
      position: absolute;
      top: 3px;
      transition: left 200ms ease-in;
      width: 26px;
      z-index: 1;
    }

    .c1 {
      cursor: pointer;
      opacity: 0;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 3;
    }

    .c1:checked+.c2 {
      left: calc(100% - 30px);
    }

    .c1:focus+.c2 {
      box-shadow: var(--shadows-focus);
    }

    .c1:hover+.c2:not(:disabled):not(:checked) {
      box-shadow: var(--shadows-focus);
    }

    .c0 {
      align-items: center;
      background-color: var(--colors-success);
      border-radius: 24px;
      box-shadow: var(--shadows-inset);
      cursor: pointer;
      display: inline-flex;
      height: 32px;
      position: relative;
      transition: background-color 200ms;
      width: 56px;
    }

    <div
        class="c0"
        scale="md"
      >
        <input
          class="c1"
          scale="md"
          type="checkbox"
        />
        <div
          class="c2 c3"
          scale="md"
        />
      </div>
    </DocumentFragment>
  `);
});

it("renders correctly scale sm", () => {
  const { asFragment } = renderWithProvider(<Toggle checked onChange={handleChange} scale="sm" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c3 {
      background-color: var(--colors-backgroundAlt);
      border-radius: 50%;
      cursor: pointer;
      height: 16px;
      left: 2px;
      position: absolute;
      top: 2px;
      transition: left 200ms ease-in;
      width: 16px;
      z-index: 1;
    }

    .c1 {
      cursor: pointer;
      opacity: 0;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 3;
    }

    .c1:checked+.c2 {
      left: calc(100% - 18px);
    }

    .c1:focus+.c2 {
      box-shadow: var(--shadows-focus);
    }

    .c1:hover+.c2:not(:disabled):not(:checked) {
      box-shadow: var(--shadows-focus);
    }

    .c0 {
      align-items: center;
      background-color: var(--colors-success);
      border-radius: 24px;
      box-shadow: var(--shadows-inset);
      cursor: pointer;
      display: inline-flex;
      height: 20px;
      position: relative;
      transition: background-color 200ms;
      width: 36px;
    }

    <div
        class="c0"
        scale="sm"
      >
        <input
          class="c1"
          scale="sm"
          type="checkbox"
        />
        <div
          class="c2 c3"
          scale="sm"
        />
      </div>
    </DocumentFragment>
  `);
});
