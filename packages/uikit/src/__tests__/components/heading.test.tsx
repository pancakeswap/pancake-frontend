import { expect, it } from "vitest";
import Heading from "../../components/Heading/Heading";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Heading>Title</Heading>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      color: var(--colors-text);
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c1 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.1;
    }

    @media screen and (min-width: 968px) {
      .c1 {
        font-size: 20px;
      }
    }

    <h2
        class="c0 c1"
      >
        Title
      </h2>
    </DocumentFragment>
  `);
});
