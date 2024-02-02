import { expect, it } from "vitest";
import Skeleton from "../../components/Skeleton/Skeleton";
import { renderWithProvider } from "../../testHelpers";

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Skeleton />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-height: 20px;
      display: block;
      background-color: var(--colors-backgroundDisabled);
      border-radius: var(--radii-small);
    }

    .c1 {
      animation: wAFEO 2s infinite ease-out;
      transform: translate3d(0, 0, 0);
    }

    <div
        class="c0 c1"
      />
    </DocumentFragment>
  `);
});

it("renders correctly avatar", () => {
  const { asFragment } = renderWithProvider(<Skeleton width={50} height={50} variant="circle" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-height: 20px;
      display: block;
      background-color: var(--colors-backgroundDisabled);
      border-radius: var(--radii-circle);
      width: 50px;
      height: 50px;
    }

    .c1 {
      animation: wAFEO 2s infinite ease-out;
      transform: translate3d(0, 0, 0);
    }

    <div
        class="c0 c1"
      />
    </DocumentFragment>
  `);
});

it("renders correctly waves animation", () => {
  const { asFragment } = renderWithProvider(<Skeleton width={50} height={50} animation="waves" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-height: 20px;
      display: block;
      background-color: var(--colors-backgroundDisabled);
      border-radius: var(--radii-small);
      width: 50px;
      height: 50px;
    }

    .c1 {
      overflow: hidden;
      transform: translate3d(0, 0, 0);
    }

    .c1:before {
      content: "";
      position: absolute;
      background-image: linear-gradient(90deg, transparent, rgba(243, 243, 243, 0.5), transparent);
      top: 0;
      left: -150px;
      height: 100%;
      width: 150px;
      animation: kudDcV 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    <div
        class="c0 c1"
      />
    </DocumentFragment>
  `);
});
