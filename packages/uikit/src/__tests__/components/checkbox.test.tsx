import React from "react";
import { renderWithProvider } from "../../testHelpers";
import Checkbox from "../../components/Checkbox/Checkbox";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<Checkbox checked onChange={handleChange} />);
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
      border-radius: 8px;
      background-color: #eeeaf4;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
    }

    .c0:after {
      content: "";
      position: absolute;
      border-bottom: 2px solid;
      border-left: 2px solid;
      border-color: transparent;
      top: 30%;
      left: 0;
      right: 0;
      width: 50%;
      height: 25%;
      margin: auto;
      -webkit-transform: rotate(-50deg);
      -ms-transform: rotate(-50deg);
      transform: rotate(-50deg);
      -webkit-transition: border-color 0.2s ease-in-out;
      transition: border-color 0.2s ease-in-out;
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
      border-color: white;
    }

    .c0:disabled {
      cursor: default;
      opacity: 0.6;
    }

    <input
        checked=""
        class="c0"
        scale="md"
        type="checkbox"
      />
    </DocumentFragment>
  `);
});
