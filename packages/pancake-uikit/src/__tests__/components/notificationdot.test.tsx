import React from "react";
import { renderWithTheme } from "../../testHelpers";
import NotificationDot from "../../components/NotificationDot/NotificationDot";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(
    <NotificationDot>
      <div />
    </NotificationDot>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      position: relative;
    }

    .c1 {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 10px;
      pointer-events: none;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      background-color: #ED4B9E;
    }

    <span
        class="c0"
      >
        <div />
        <span
          class="c1"
          color="failure"
        />
      </span>
    </DocumentFragment>
  `);
});
