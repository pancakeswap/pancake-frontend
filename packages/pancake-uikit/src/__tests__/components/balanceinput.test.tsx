import React from "react";
import { renderWithTheme } from "../../testHelpers";
import BalanceInput from "../../components/BalanceInput/BalanceInput";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<BalanceInput value="14" currencyValue="15 USD" onChange={handleChange} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-gsTCUz sc-hKgILt jLyPtw bSJkHm"
      >
        <input
          class="sc-dlfnbm sc-eCssSg iIlYpN jebGQw"
          placeholder="0.0"
          scale="md"
          type="text"
          value="14"
        />
        <div
          class="sc-bdfBwQ hRRNWZ"
          color="textSubtle"
          font-size="12px"
        >
          15 USD
        </div>
      </div>
    </DocumentFragment>
  `);
});
