import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Progress from "../../components/Progress/Progress";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Progress primaryStep={50} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c2 {
      position: absolute;
      top: 0;
      left: 0;
      background-color: #7645D9;
      height: 100%;
      -webkit-transition: width 200ms ease;
      transition: width 200ms ease;
    }

    .c0 {
      position: relative;
      background-color: #eeeaf4;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
      overflow: hidden;
      border-radius: 32px;
      height: 16px;
    }

    .c0 .c1 {
      border-top-left-radius: 32px;
      border-bottom-left-radius: 32px;
    }

    <div
        class="c0"
        scale="md"
      >
        <div
          class="c1 c2"
          style="width: 50%;"
        />
      </div>
    </DocumentFragment>
  `);
});
