import React from "react";
import { renderWithProvider } from "../../testHelpers";
import Dropdown from "../../components/Dropdown/Dropdown";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Dropdown target={<div>target</div>} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c2 {
      width: -webkit-max-content;
      width: -moz-max-content;
      width: max-content;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      position: absolute;
      -webkit-transform: translate(-50%,0);
      -ms-transform: translate(-50%,0);
      transform: translate(-50%,0);
      left: 50%;
      bottom: auto;
      background-color: #FFFFFF;
      box-shadow: 0px 2px 12px -8px rgba(25,19,38,0.1),0px 1px 1px rgba(25,19,38,0.05);
      padding: 16px;
      max-height: 0px;
      overflow: hidden;
      z-index: 10;
      border-radius: 4px;
      opacity: 0;
      -webkit-transition: max-height 0s 0.3s,opacity 0.3s ease-in-out;
      transition: max-height 0s 0.3s,opacity 0.3s ease-in-out;
      will-change: opacity;
      pointer-events: none;
    }

    .c0 {
      position: relative;
    }

    .c0:hover .c1,
    .c0:focus-within .c1 {
      opacity: 1;
      max-height: 400px;
      overflow-y: auto;
      -webkit-transition: max-height 0s 0s,opacity 0.3s ease-in-out;
      transition: max-height 0s 0s,opacity 0.3s ease-in-out;
      pointer-events: auto;
    }

    <div
        class="c0"
      >
        <div>
          target
        </div>
        <div
          class="c1 c2"
        />
      </div>
    </DocumentFragment>
  `);
});
