import { expect, it } from "vitest";
import { Overlay } from "../../components/Overlay";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Overlay />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      background-color: var(--colors-text99);
      z-index: 20;
      will-change: opacity;
      animation: dHqLl 350ms ease forwards;
    }

    <div
        class="c0"
        role="presentation"
      />
    </DocumentFragment>
  `);
});
