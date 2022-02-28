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
      background: #E7E3EB;
      border-radius: 24px;
      color: #280D5F;
      overflow: hidden;
      position: relative;
      padding: 1px 1px 3px 1px;
    }

    .c1 {
      width: 100%;
      height: 100%;
      overflow: inherit;
      background: #FFFFFF;
      border-radius: 24px;
    }

    .c3 {
      padding: 24px;
    }

    .c2 {
      background: linear-gradient(111.68deg,#F2ECF2 0%,#E8F2F6 100%);
      border-radius: 24px 24px 0 0;
      padding: 24px;
    }

    .c4 {
      border-top: 1px solid #E7E3EB;
      padding: 24px;
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          <div
            class="c2"
          >
            Header
          </div>
          <div
            class="c3"
          >
            Body
          </div>
          <div
            class="c4"
          >
            Footer
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
