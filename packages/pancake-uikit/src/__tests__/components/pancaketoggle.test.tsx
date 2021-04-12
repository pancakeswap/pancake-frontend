import React from "react";
import { renderWithTheme } from "../../testHelpers";
import PancakeToggle from "../../components/PancakeToggle/PancakeToggle";

const handleChange = jest.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithTheme(<PancakeToggle checked onChange={handleChange} scale="md" />);
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
      -webkit-transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
      transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
    }

    .c0 .pancake {
      background: #e27c31;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      position: absolute;
      -webkit-transition: 0.4s ease;
      transition: 0.4s ease;
      top: 2px;
      left: 4px;
      box-shadow: 0 2px 0 2px #fbbe7c;
    }

    .c0 .pancake:nth-child(1) {
      background: #FFFFFF;
      box-shadow: 0 2px 0 2px #BDC2C4;
    }

    .c0 .pancake:nth-child(2) {
      left: 0;
      top: -3px;
      -webkit-transform: scale(0);
      -ms-transform: scale(0);
      transform: scale(0);
      -webkit-transition: 0.2s ease 0.2s;
      transition: 0.2s ease 0.2s;
    }

    .c0 .pancake:nth-child(3) {
      top: -8px;
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
      top: 20px;
      left: 5px;
    }

    .c0 .pancake:nth-child(3):after {
      top: 22px;
      right: 5px;
    }

    .c0 .butter {
      width: 12px;
      height: 11px;
      background: #fbdb60;
      top: 3px;
      left: 16px;
      position: absolute;
      border-radius: 4px;
      box-shadow: 0 1px 0 1px #d67823;
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
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c1:checked + label .pancakes {
      -webkit-transform: translateX(34px);
      -ms-transform: translateX(34px);
      transform: translateX(34px);
    }

    .c1:checked + label .pancake:nth-child(1) {
      background: #e27c31;
      box-shadow: 0 2px 0 2px #fbbe7c;
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
      width: 72px;
      height: 40px;
      background: #31D0AA;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
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
  const { asFragment } = renderWithTheme(<PancakeToggle checked onChange={handleChange} scale="sm" />);
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
      -webkit-transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
      transition: 0.6s cubic-bezier(0.175,0.885,0.32,1.275);
    }

    .c0 .pancake {
      background: #e27c31;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      position: absolute;
      -webkit-transition: 0.4s ease;
      transition: 0.4s ease;
      top: 2px;
      left: 4px;
      box-shadow: 0 1px 0 1px #fbbe7c;
    }

    .c0 .pancake:nth-child(1) {
      background: #FFFFFF;
      box-shadow: 0 1px 0 1px #BDC2C4;
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
      box-shadow: 0px 0px 0px 1px #7645D9,0px 0px 0px 4px rgba(118,69,217,0.6);
    }

    .c1:checked + label .pancakes {
      -webkit-transform: translateX(16px);
      -ms-transform: translateX(16px);
      transform: translateX(16px);
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
      background: #31D0AA;
      box-shadow: inset 0px 2px 2px -1px rgba(74,74,104,0.1);
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
