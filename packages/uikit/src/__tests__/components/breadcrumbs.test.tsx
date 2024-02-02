import { expect, it } from "vitest";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Breadcrumbs>Link</Breadcrumbs>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      list-style-type: none;
    }

    .c0 a {
      color: var(--colors-primary);
    }

    .c0 a:hover {
      color: var(--colors-primaryBright);
    }

    <ul
        class="c0"
      />
    </DocumentFragment>
  `);
});
