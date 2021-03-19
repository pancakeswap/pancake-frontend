import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { TabMenu, Tab } from "../../components/TabMenu";

const handleClick = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(
    <TabMenu activeIndex={0} onItemClick={handleClick}>
      <Tab>Item 1</Tab>
      <Tab>Item 2</Tab>
    </TabMenu>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ sc-gsTCUz sc-dlfnbm iwJkGQ ckYhbt hfSAvK"
      >
        <div
          class="sc-bdfBwQ sc-gsTCUz sc-hKgILt iwJkGQ ckYhbt kGuCa-d"
        >
          <button
            class="sc-eCssSg ixipzp"
            color="card"
          >
            <div
              class="sc-jSgupP dTcSYX"
              color="card"
              font-weight="600"
            >
              Item 1
            </div>
          </button>
          <button
            class="sc-eCssSg bTcWnb"
            color="textSubtle"
          >
            <div
              class="sc-jSgupP fEsPNW"
              color="textSubtle"
              font-weight="600"
            >
              Item 2
            </div>
          </button>
        </div>
      </div>
    </DocumentFragment>
  `);
});
