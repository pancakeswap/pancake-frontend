import React from "react";
import { renderWithTheme } from "../../testHelpers";
import Radio from "../../components/Radio/Radio";

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<Radio name="radio" value="1" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      display: inline-block;
      height: 32px;
      width: 32px;
      vertical-align: middle;
      -webkit-transition: background-color 0.2s ease-in-out;
      transition: background-color 0.2s ease-in-out;
      border: 0;
      border-radius: 50%;
      background-color: #eeeaf4;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
      margin: 0;
    }

    .c0:after {
      border-radius: 50%;
      content: "";
      height: 20px;
      left: 6px;
      position: absolute;
      top: 6px;
      width: 20px;
    }

    .c0:hover:not(:disabled):not(:checked) {
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c0:focus {
      outline: none;
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c0:checked {
      background-color: #31D0AA;
    }

    .c0:checked:after {
      background-color: #FFFFFF;
    }

    .c0:disabled {
      cursor: default;
      opacity: 0.6;
    }

    <input
        class="c0"
        name="radio"
        scale="md"
        type="radio"
        value="1"
      />
    </DocumentFragment>
  `);
});
