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
        class="sc-bdvvaa sc-gsDJrp sc-dkPtyc gaVyZU hzWwMj ipUbgm"
      >
        <div
          class="sc-bdvvaa sc-gsDJrp sc-hKwCoD gaVyZU hzWwMj joasFC"
        >
          <button
            class="sc-eCImvq gfevKM"
            color="card"
          >
            <div
              class="sc-jRQAMF kpBUCd"
              color="card"
              font-weight="600"
            >
              Item 1
            </div>
          </button>
          <button
            class="sc-eCImvq hWcBJK"
            color="textSubtle"
          >
            <div
              class="sc-jRQAMF ftBIrs"
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
