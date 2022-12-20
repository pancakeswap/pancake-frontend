import { renderWithProvider } from "../../testHelpers";
import { Spinner } from "../../components/Spinner";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Spinner />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: relative;
    }

    <div
        class="c0"
      >
        <img
          alt="pancake-3d-spinner"
          data-nimg="1"
          decoding="async"
          height="153.216"
          loading="lazy"
          src="/_next/image?url=https%3A%2F%2Fpancakeswap.finance%2Fimages%2Fpancake-3d-spinner.gif&w=256&q=75"
          srcset="/_next/image?url=https%3A%2F%2Fpancakeswap.finance%2Fimages%2Fpancake-3d-spinner.gif&w=128&q=75 1x, /_next/image?url=https%3A%2F%2Fpancakeswap.finance%2Fimages%2Fpancake-3d-spinner.gif&w=256&q=75 2x"
          style="color: transparent;"
          width="128"
        />
      </div>
    </DocumentFragment>
  `);
});
