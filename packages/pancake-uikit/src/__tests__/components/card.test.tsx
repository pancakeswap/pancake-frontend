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
      .c0 {
      background-color: #FFFFFF;
      border: 0px 2px 12px -8px rgba(25,19,38,0.1),0px 1px 1px rgba(25,19,38,0.05);
      border-radius: 32px;
      box-shadow: 0px 2px 12px -8px rgba(25,19,38,0.1),0px 1px 1px rgba(25,19,38,0.05);
      color: #280D5F;
      overflow: hidden;
      position: relative;
    }

    .c2 {
      padding: 24px;
    }

    .c1 {
      background: linear-gradient(111.68deg,#F2ECF2 0%,#E8F2F6 100%);
      padding: 24px;
    }

    .c3 {
      border-top: 1px solid #E9EAEB;
      padding: 24px;
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          Header
        </div>
        <div
          class="c2"
        >
          Body
        </div>
        <div
          class="c3"
        >
          Footer
        </div>
      </div>
    </DocumentFragment>
  `);
});
