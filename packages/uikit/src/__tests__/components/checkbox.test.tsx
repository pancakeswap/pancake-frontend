import { expect, it, vi } from "vitest";
import Checkbox from "../../components/Checkbox/Checkbox";
import { renderWithProvider } from "../../testHelpers";

const handleChange = vi.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Checkbox checked onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      appearance: none;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      display: inline-block;
      height: 32px;
      width: 32px;
      min-height: 32px;
      min-width: 32px;
      vertical-align: middle;
      transition: background-color 0.2s ease-in-out;
      border: 0;
      border-radius: 8px;
      background-color: var(--colors-cardBorder);
      box-shadow: var(--shadows-inset);
    }

    .c0:before {
      content: "";
      position: absolute;
      border-top: 2px solid;
      border-color: transparent;
      top: 50%;
      left: 50%;
      width: 33%;
      height: 0;
      margin: auto;
      transform: translate(-50%, -50%);
      transition: border-color 0.2s ease-in-out;
    }

    .c0:after {
      content: "";
      position: absolute;
      border-bottom: 2px solid;
      border-left: 2px solid;
      border-color: transparent;
      top: 30%;
      left: 0;
      right: 0;
      width: 50%;
      height: 25%;
      margin: auto;
      transform: rotate(-50deg);
      transition: border-color 0.2s ease-in-out;
    }

    .c0:hover:not(:disabled):not(:checked) {
      box-shadow: var(--shadows-focus);
    }

    .c0:focus {
      outline: none;
      box-shadow: var(--shadows-focus);
    }

    .c0:checked {
      border: 0;
      background-color: var(--colors-success);
    }

    .c0:checked:after {
      border-color: white;
    }

    .c0:disabled {
      border: 0;
      cursor: default;
      opacity: 0.6;
    }

    <input
        class="c0"
        scale="md"
        type="checkbox"
      />
    </DocumentFragment>
  `);
});
