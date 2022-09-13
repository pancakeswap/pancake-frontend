import React from "react";
import { renderWithProvider } from "../../testHelpers";
import Input from "../../components/Input/Input";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Input type="text" value="input" onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      background-color: var(--colors-input);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      color: var(--colors-text);
      display: block;
      font-size: 16px;
      height: 40px;
      outline: 0;
      padding: 0 16px;
      width: 100%;
      border: 1px solid var(--colors-inputSecondary);
    }

    .c0::-webkit-input-placeholder {
      color: var(--colors-textSubtle);
    }

    .c0::-moz-placeholder {
      color: var(--colors-textSubtle);
    }

    .c0:-ms-input-placeholder {
      color: var(--colors-textSubtle);
    }

    .c0::placeholder {
      color: var(--colors-textSubtle);
    }

    .c0:disabled {
      background-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c0:focus:not(:disabled) {
      box-shadow: var(--shadows-focus);
    }

    <input
        class="c0"
        scale="md"
        type="text"
        value="input"
      />
    </DocumentFragment>
  `);
});
