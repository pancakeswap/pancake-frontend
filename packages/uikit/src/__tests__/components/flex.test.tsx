import { expect, it } from "vitest";
import Flex from "../../components/Box/Flex";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Flex>flex</Flex>);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      display: flex;
    }

    <div
        class="c0"
      >
        flex
      </div>
    </DocumentFragment>
  `);
});
