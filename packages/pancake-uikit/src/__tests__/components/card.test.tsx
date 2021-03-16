import React from "react";
import { renderWithTheme } from "../../testHelpers";
import { Card, CardBody, CardHeader, CardFooter } from "../../components/Card";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(
    <Card>
      <CardHeader>Header</CardHeader>
      <CardBody>Body</CardBody>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="sc-bdfBwQ gppsKf"
      >
        <div
          class="sc-dlfnbm bwJRqk"
        >
          Header
        </div>
        <div
          class="sc-gsTCUz iMfsSF"
        >
          Body
        </div>
        <div
          class="sc-hKgILt gKiPqy"
        >
          Footer
        </div>
      </div>
    </DocumentFragment>
  `);
});
