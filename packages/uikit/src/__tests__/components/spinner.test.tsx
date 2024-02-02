import { expect, it } from "vitest";
import { Spinner } from "../../components/Spinner";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Spinner />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      width: 128px;
      height: 153.216px;
      position: relative;
    }

    .c1 {
      max-height: 153.216px;
      max-width: 128px;
      position: relative;
      width: 100%;
    }

    .c1:after {
      content: "";
      display: block;
      padding-top: 119.7%;
    }

    .c2 {
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          <div
            class="c2"
          />
        </div>
      </div>
    </DocumentFragment>
  `);
});
