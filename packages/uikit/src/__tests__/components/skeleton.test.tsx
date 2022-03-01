import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Skeleton from "../../components/Skeleton/Skeleton";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Skeleton />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-height: 20px;
      display: block;
      background-color: #E9EAEB;
      border-radius: 4px;
    }

    .c1 {
      -webkit-animation: wAFEO 2s infinite ease-out;
      animation: wAFEO 2s infinite ease-out;
      -webkit-transform: translate3d(0,0,0);
      -ms-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
    }

    <div
        class="c0 c1"
      />
    </DocumentFragment>
  `);
});

it("renders correctly avatar", () => {
  const { asFragment } = renderWithTheme(<Skeleton width={50} height={50} variant="circle" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-height: 20px;
      display: block;
      background-color: #E9EAEB;
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }

    .c1 {
      -webkit-animation: wAFEO 2s infinite ease-out;
      animation: wAFEO 2s infinite ease-out;
      -webkit-transform: translate3d(0,0,0);
      -ms-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
    }

    <div
        class="c0 c1"
        height="50"
        width="50"
      />
    </DocumentFragment>
  `);
});

it("renders correctly waves animation", () => {
  const { asFragment } = renderWithTheme(<Skeleton width={50} height={50} animation="waves" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-height: 20px;
      display: block;
      background-color: #E9EAEB;
      border-radius: 4px;
      width: 50px;
      height: 50px;
    }

    .c1 {
      position: relative;
      overflow: hidden;
      -webkit-transform: translate3d(0,0,0);
      -ms-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
    }

    .c1:before {
      content: "";
      position: absolute;
      background-image: linear-gradient(90deg,transparent,rgba(243,243,243,0.5),transparent);
      top: 0;
      left: -150px;
      height: 100%;
      width: 150px;
      -webkit-animation: kudDcV 2s cubic-bezier(0.4,0,0.2,1) infinite;
      animation: kudDcV 2s cubic-bezier(0.4,0,0.2,1) infinite;
    }

    <div
        class="c0 c1"
        height="50"
        width="50"
      />
    </DocumentFragment>
  `);
});
