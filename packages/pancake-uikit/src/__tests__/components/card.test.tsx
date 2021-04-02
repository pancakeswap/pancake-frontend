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
        class="sc-bdvvaa QgjRP"
      >
        <div
          class="sc-dkPtyc dPqJYu"
        >
          Header
        </div>
        <div
          class="sc-gsDJrp bNXekX"
        >
          Body
        </div>
        <div
          class="sc-hKwCoD kCvFCJ"
        >
          Footer
        </div>
      </div>
    </DocumentFragment>
  `);
});
