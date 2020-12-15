import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { Card, CardBody, CardFooter } from "../../components/Card";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(
    <Card>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ cZfuWT"
      >
        <div
          class="sc-gsTCUz iMfsSF"
        >
          Body
        </div>
        <div
          class="sc-dlfnbm eDxzKs"
        >
          Footer
        </div>
      </div>
    </DocumentFragment>
  `);
});
