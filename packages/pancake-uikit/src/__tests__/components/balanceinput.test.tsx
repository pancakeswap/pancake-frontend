import React from "react";
import { renderWithTheme } from "../../testHelpers";
import BalanceInput from "../../components/BalanceInput/BalanceInput";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<BalanceInput value="14" currencyValue="15 USD" onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c3 {
      color: #8f80ba;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
      font-size: 12px;
      text-align: right;
    }

    .c1 {
      background-color: #eeeaf4;
      border: 0;
      border-radius: 16px;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
      color: #452A7A;
      display: block;
      font-size: 16px;
      height: 40px;
      outline: 0;
      padding: 0 16px;
      width: 100%;
    }

    .c1::-webkit-input-placeholder {
      color: #8f80ba;
    }

    .c1::-moz-placeholder {
      color: #8f80ba;
    }

    .c1:-ms-input-placeholder {
      color: #8f80ba;
    }

    .c1::placeholder {
      color: #8f80ba;
    }

    .c1:disabled {
      background-color: #E9EAEB;
      box-shadow: none;
      color: #BDC2C4;
      cursor: not-allowed;
    }

    .c1:focus:not(:disabled) {
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c0 {
      background-color: #eeeaf4;
      border: 1px solid #d7caec;
      border-radius: 16px;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
      padding: 8px 16px;
    }

    .c2 {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      padding-left: 0;
      padding-right: 0;
      text-align: right;
    }

    .c2::-webkit-input-placeholder {
      color: #8f80ba;
    }

    .c2::-moz-placeholder {
      color: #8f80ba;
    }

    .c2:-ms-input-placeholder {
      color: #8f80ba;
    }

    .c2::placeholder {
      color: #8f80ba;
    }

    .c2:focus:not(:disabled) {
      box-shadow: none;
    }

    <div
        class="c0"
      >
        <input
          class="c1 c2"
          placeholder="0.0"
          scale="md"
          type="number"
          value="14"
        />
        <div
          class="c3"
          color="textSubtle"
          font-size="12px"
        >
          15 USD
        </div>
      </div>
    </DocumentFragment>
  `);
});
