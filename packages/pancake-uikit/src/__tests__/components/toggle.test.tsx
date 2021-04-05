import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Toggle from "../../components/Toggle/Toggle";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Toggle checked onChange={handleChange} scale="md" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c3 {
      background-color: #FFFFFF;
      border-radius: 50%;
      cursor: pointer;
      height: 32px;
      left: 4px;
      position: absolute;
      top: 4px;
      -webkit-transition: left 200ms ease-in;
      transition: left 200ms ease-in;
      width: 32px;
      z-index: 1;
    }

    .c1 {
      cursor: pointer;
      opacity: 0;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 3;
    }

    .c1:checked + .c2 {
      left: calc(100% - 36px);
    }

    .c1:focus + .c2 {
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c1:hover + .c2:not(:disabled):not(:checked) {
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c0 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background-color: #31D0AA;
      border-radius: 24px;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      height: 40px;
      position: relative;
      -webkit-transition: background-color 200ms;
      transition: background-color 200ms;
      width: 72px;
    }

    <div
        class="c0"
        scale="md"
      >
        <input
          checked=""
          class="c1"
          scale="md"
          type="checkbox"
        />
        <div
          class="c2 c3"
          scale="md"
        />
      </div>
    </DocumentFragment>
  `);
});

it("renders correctly scale sm", () => {
  const { asFragment } = renderWithTheme(<Toggle checked onChange={handleChange} scale="sm" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c3 {
      background-color: #FFFFFF;
      border-radius: 50%;
      cursor: pointer;
      height: 16px;
      left: 2px;
      position: absolute;
      top: 2px;
      -webkit-transition: left 200ms ease-in;
      transition: left 200ms ease-in;
      width: 16px;
      z-index: 1;
    }

    .c1 {
      cursor: pointer;
      opacity: 0;
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 3;
    }

    .c1:checked + .c2 {
      left: calc(100% - 18px);
    }

    .c1:focus + .c2 {
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c1:hover + .c2:not(:disabled):not(:checked) {
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c0 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background-color: #31D0AA;
      border-radius: 24px;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      height: 20px;
      position: relative;
      -webkit-transition: background-color 200ms;
      transition: background-color 200ms;
      width: 36px;
    }

    <div
        class="c0"
        scale="sm"
      >
        <input
          checked=""
          class="c1"
          scale="sm"
          type="checkbox"
        />
        <div
          class="c2 c3"
          scale="sm"
        />
      </div>
    </DocumentFragment>
  `);
});
