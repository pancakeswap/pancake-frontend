import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Progress from "../../components/Progress/Progress";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Progress primaryStep={50} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-gsTCUz cECZDH"
      >
        <div
          class="sc-bdfBwQ dfCzcs"
          style="width: 50%;"
        />
      </div>
    </DocumentFragment>
  `);
});
