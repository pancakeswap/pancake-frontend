import { expect, it } from "vitest";
import Tag from "../../components/Tag/Tag";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Tag>Core</Tag>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      align-items: center;
      border-radius: 16px;
      color: #ffffff;
      display: inline-flex;
      font-weight: 400;
      white-space: nowrap;
      height: 28px;
      padding: 0 8px;
      font-size: 14px;
      background-color: var(--colors-primary);
    }

    .c0>svg {
      fill: currentColor;
    }

    <div
        class="c0"
        scale="md"
      >
        Core
      </div>
    </DocumentFragment>
  `);
});
