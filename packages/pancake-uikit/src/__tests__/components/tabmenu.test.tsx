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
      .c0 {
      padding: 0 4px;
    }

    .c1 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .c2 {
      border-bottom: 2px solid #8f80ba;
      overflow-x: scroll;
      -ms-overflow-style: none;
      -webkit-scrollbar-width: none;
      -moz-scrollbar-width: none;
      -ms-scrollbar-width: none;
      scrollbar-width: none;
    }

    .c2::-webkit-scrollbar {
      display: none;
    }

    .c3 {
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-flex: 1;
      -webkit-flex-grow: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;
    }

    .c3 > button + button {
      margin-left: 4px;
    }

    .c4 {
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      cursor: pointer;
      border: 0;
      outline: 0;
      -webkit-box-flex: 1;
      -webkit-flex-grow: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;
      padding: 8px;
      border-radius: 16px 16px 0 0;
      color: #FFFFFF;
      background-color: #8f80ba;
    }

    .c6 {
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      cursor: pointer;
      border: 0;
      outline: 0;
      -webkit-box-flex: 1;
      -webkit-flex-grow: 1;
      -ms-flex-positive: 1;
      flex-grow: 1;
      padding: 8px;
      border-radius: 16px 16px 0 0;
      color: #8f80ba;
      background-color: #eeeaf4;
    }

    .c5 {
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      font-weight: 600;
    }

    .c7 {
      color: #8f80ba;
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      font-weight: 600;
    }

    @media screen and (min-width:370px) {
      .c0 {
        padding: 0 16px;
      }
    }

    @media screen and (min-width:852px) {
      .c3 {
        -webkit-box-flex: 0;
        -webkit-flex-grow: 0;
        -ms-flex-positive: 0;
        flex-grow: 0;
      }
    }

    @media screen and (min-width:852px) {
      .c4 {
        -webkit-box-flex: 0;
        -webkit-flex-grow: 0;
        -ms-flex-positive: 0;
        flex-grow: 0;
        padding: 8px 12px;
      }
    }

    @media screen and (min-width:852px) {
      .c6 {
        -webkit-box-flex: 0;
        -webkit-flex-grow: 0;
        -ms-flex-positive: 0;
        flex-grow: 0;
        padding: 8px 12px;
      }
    }

    <div
        class="c0 c1 c2"
      >
        <div
          class="c1 c3"
        >
          <button
            class="c4"
            color="backgroundAlt"
          >
            <div
              class="c5"
              color="backgroundAlt"
              font-weight="600"
            >
              Item 1
            </div>
          </button>
          <button
            class="c6"
            color="textSubtle"
          >
            <div
              class="c7"
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
