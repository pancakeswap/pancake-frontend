import React from "react";
import { renderWithProvider } from "../../testHelpers";
import PancakeToggle from "../../components/PancakeToggle/PancakeToggle";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(<PancakeToggle checked onChange={handleChange} scale="md" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: relative;
      display: inline-block;
    }

    .c0:label:before {
      content: none;
    }

    .c0 .pancakes {
      position: absolute;
      -webkit-transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
      transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
    }

    .c0 .pancake {
      background: #e27c31;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      position: absolute;
      -webkit-transition: 0.4s ease;
      transition: 0.4s ease;
      top: 2px;
      left: 4px;
      box-shadow: 0 1.5px 0 1.5px #fbbe7c;
    }

    .c0 .pancake:nth-child(1) {
      background: var(--colors-backgroundAlt);
      box-shadow: 0 1.5px 0 1.5px var(--colors-textDisabled);
    }

    .c0 .pancake:nth-child(2) {
      left: 0;
      top: -1px;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease 0.2s;
      transition: 0.2s ease 0.2s;
    }

    .c0 .pancake:nth-child(3) {
      top: -6px;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease 0.2s;
      transition: 0.2s ease 0.2s;
    }

    .c0 .pancake:nth-child(3):before,
    .c0 .pancake:nth-child(3):after {
      content: "";
      position: absolute;
      background: #ef8927;
      border-radius: 20px;
      width: 50%;
      height: 20%;
    }

    .c0 .pancake:nth-child(3):before {
      top: 15px;
      left: 3.75px;
    }

    .c0 .pancake:nth-child(3):after {
      top: 16px;
      right: 3.75px;
    }

    .c0 .butter {
      width: 10px;
      height: 8px;
      background: #fbdb60;
      top: 5px;
      left: 13px;
      position: absolute;
      border-radius: 3px;
      box-shadow: 0 0.75px 0 0.75px #d67823;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease;
      transition: 0.2s ease;
    }

    .c1 {
      height: 40px;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      width: 40px;
    }

    .c1:focus + label {
      box-shadow: var(--shadows-focus);
    }

    .c1:checked + label .pancakes {
      -webkit-transform: translateX(24px);
      -ms-transform: translateX(24px);
      transform: translateX(24px);
    }

    .c1:checked + label .pancake:nth-child(1) {
      background: #e27c31;
      box-shadow: 0 1.5px 0 1.5px #fbbe7c;
      -webkit-transition-delay: 0.2s;
      transition-delay: 0.2s;
    }

    .c1:checked + label .pancake:nth-child(2) {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition-delay: 0.2s;
      transition-delay: 0.2s;
    }

    .c1:checked + label .pancake:nth-child(3) {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition-delay: 0.4s;
      transition-delay: 0.4s;
    }

    .c1:checked + label .butter {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition-delay: 0.6s;
      transition-delay: 0.6s;
    }

    .c2 {
      width: 56px;
      height: 32px;
      background: var(--colors-success);
      box-shadow: var(--shadows-inset);
      display: inline-block;
      border-radius: 50px;
      position: relative;
      -webkit-transition: all 0.3s ease;
      transition: all 0.3s ease;
      -webkit-transform-origin: 20% center;
      -ms-transform-origin: 20% center;
      transform-origin: 20% center;
      cursor: pointer;
    }

    <div
        class="c0"
        scale="md"
      >
        <input
          checked=""
          class="c1"
          id="pancake-toggle"
          scale="md"
          type="checkbox"
        />
        <label
          class="c2"
          for="pancake-toggle"
          scale="md"
        >
          <div
            class="pancakes"
          >
            <div
              class="pancake"
            />
            <div
              class="pancake"
            />
            <div
              class="pancake"
            />
            <div
              class="butter"
            />
          </div>
        </label>
      </div>
    </DocumentFragment>
  `);
});

it("renders correctly scale sm", () => {
  const { asFragment } = renderWithProvider(<PancakeToggle checked onChange={handleChange} scale="sm" />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      position: relative;
      display: inline-block;
    }

    .c0:label:before {
      content: none;
    }

    .c0 .pancakes {
      position: absolute;
      -webkit-transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
      transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
    }

    .c0 .pancake {
      background: #e27c31;
      border-radius: 50%;
      width: 14px;
      height: 14px;
      position: absolute;
      -webkit-transition: 0.4s ease;
      transition: 0.4s ease;
      top: 2px;
      left: 4px;
      box-shadow: 0 1px 0 1px #fbbe7c;
    }

    .c0 .pancake:nth-child(1) {
      background: var(--colors-backgroundAlt);
      box-shadow: 0 1px 0 1px var(--colors-textDisabled);
    }

    .c0 .pancake:nth-child(2) {
      left: 0;
      top: 0px;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease 0.2s;
      transition: 0.2s ease 0.2s;
    }

    .c0 .pancake:nth-child(3) {
      top: -3px;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease 0.2s;
      transition: 0.2s ease 0.2s;
    }

    .c0 .pancake:nth-child(3):before,
    .c0 .pancake:nth-child(3):after {
      content: "";
      position: absolute;
      background: #ef8927;
      border-radius: 20px;
      width: 50%;
      height: 20%;
    }

    .c0 .pancake:nth-child(3):before {
      top: 10px;
      left: 2.5px;
    }

    .c0 .pancake:nth-child(3):after {
      top: 11px;
      right: 2.5px;
    }

    .c0 .butter {
      width: 6px;
      height: 5px;
      background: #fbdb60;
      top: 3px;
      left: 10px;
      position: absolute;
      border-radius: 2px;
      box-shadow: 0 0.5px 0 0.5px #d67823;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease;
      transition: 0.2s ease;
    }

    .c1 {
      height: 40px;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      width: 40px;
    }

    .c1:focus + label {
      box-shadow: var(--shadows-focus);
    }

    .c1:checked + label .pancakes {
      -webkit-transform: translateX(14px);
      -ms-transform: translateX(14px);
      transform: translateX(14px);
    }

    .c1:checked + label .pancake:nth-child(1) {
      background: #e27c31;
      box-shadow: 0 1px 0 1px #fbbe7c;
      -webkit-transition-delay: 0.2s;
      transition-delay: 0.2s;
    }

    .c1:checked + label .pancake:nth-child(2) {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition-delay: 0.2s;
      transition-delay: 0.2s;
    }

    .c1:checked + label .pancake:nth-child(3) {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition-delay: 0.4s;
      transition-delay: 0.4s;
    }

    .c1:checked + label .butter {
      -webkit-transform: scale(1);
      -ms-transform: scale(1);
      transform: scale(1);
      -webkit-transition-delay: 0.6s;
      transition-delay: 0.6s;
    }

    .c2 {
      width: 36px;
      height: 20px;
      background: var(--colors-success);
      box-shadow: var(--shadows-inset);
      display: inline-block;
      border-radius: 50px;
      position: relative;
      -webkit-transition: all 0.3s ease;
      transition: all 0.3s ease;
      -webkit-transform-origin: 20% center;
      -ms-transform-origin: 20% center;
      transform-origin: 20% center;
      cursor: pointer;
    }

    <div
        class="c0"
        scale="sm"
      >
        <input
          checked=""
          class="c1"
          id="pancake-toggle"
          scale="sm"
          type="checkbox"
        />
        <label
          class="c2"
          for="pancake-toggle"
          scale="sm"
        >
          <div
            class="pancakes"
          >
            <div
              class="pancake"
            />
            <div
              class="pancake"
            />
            <div
              class="pancake"
            />
            <div
              class="butter"
            />
          </div>
        </label>
      </div>
    </DocumentFragment>
  `);
});
