import React from "react";
import noop from "lodash/noop";
import { renderWithProvider } from "../../testHelpers";
import ConnectModal from "../../widgets/WalletModal/ConnectModal";

it("renders ConnectModal correctly", () => {
  const { asFragment } = renderWithProvider(<ConnectModal login={noop} t={(key: string) => key} wallets={[]} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c8 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: var(--colors-primary);
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }

    .c4 {
      color: var(--colors-text);
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c15 {
      color: var(--colors-textSubtle);
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 16px;
      text-align: center;
      font-size: 16px;
    }

    .c6 {
      position: relative;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border: 0;
      border-radius: 16px;
      box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset;
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-letter-spacing: 0.03em;
      -moz-letter-spacing: 0.03em;
      -ms-letter-spacing: 0.03em;
      letter-spacing: 0.03em;
      line-height: 1;
      opacity: 1;
      outline: 0;
      -webkit-transition: background-color 0.2s,opacity 0.2s;
      transition: background-color 0.2s,opacity 0.2s;
      height: 48px;
      padding: 0 24px;
      background-color: transparent;
      color: var(--colors-primary);
      box-shadow: none;
    }

    .c6:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c6:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c6:disabled,
    .c6.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c16 {
      position: relative;
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      border: 0;
      border-radius: 16px;
      box-shadow: 0px -1px 0px 0px rgba(14,14,44,0.4) inset;
      cursor: pointer;
      display: -webkit-inline-box;
      display: -webkit-inline-flex;
      display: -ms-inline-flexbox;
      display: inline-flex;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-letter-spacing: 0.03em;
      -moz-letter-spacing: 0.03em;
      -ms-letter-spacing: 0.03em;
      letter-spacing: 0.03em;
      line-height: 1;
      opacity: 1;
      outline: 0;
      -webkit-transition: background-color 0.2s,opacity 0.2s;
      transition: background-color 0.2s,opacity 0.2s;
      height: 48px;
      padding: 0 24px;
      background-color: var(--colors-textSubtle);
      color: var(--colors-backgroundAlt);
      width: 100%;
    }

    .c16:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c16:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c16:disabled,
    .c16.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c7 {
      padding: 0;
      width: 48px;
    }

    .c9 {
      min-width: 320px;
    }

    .c11 {
      max-height: 453px;
      overflow-y: auto;
      padding-top: 24px;
      padding-bottom: 24px;
    }

    .c14 {
      padding: 24px;
    }

    .c2 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .c13 {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .c5 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.1;
    }

    .c1 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: transparent;
      border-bottom: 1px solid var(--colors-cardBorder);
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding: 12px 24px;
    }

    .c3 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }

    .c10 {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: calc(90vh - 73px);
    }

    .c0 {
      overflow: hidden;
      background: var(--colors-backgroundAlt);
      box-shadow: 0px 20px 36px -8px rgba(14,14,44,0.1),0px 1px 1px rgba(0,0,0,0.05);
      border: 1px solid var(--colors-cardBorder);
      border-radius: 32px 32px 0px 0px;
      width: 100%;
      max-height: calc(var(--vh,1vh) * 100);
      z-index: 100;
      position: absolute;
      min-width: 320px;
      bottom: 0;
      max-width: none !important;
      min-height: 300px;
    }

    .c12 {
      border-bottom: 1px solid var(--colors-cardBorder);
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c8 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    @media screen and (min-width:370px) {

    }

    @media screen and (min-width:576px) {
      .c9 {
        min-width: 340px;
      }
    }

    @media screen and (min-width:968px) {
      .c5 {
        font-size: 20px;
      }
    }

    @media screen and (min-width:852px) {
      .c1 {
        background: var(--colors-gradientBubblegum);
      }
    }

    @media screen and (min-width:852px) {
      .c10 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        max-height: 90vh;
      }
    }

    @media screen and (min-width:852px) {
      .c0 {
        width: auto;
        position: auto;
        bottom: auto;
        border-radius: 32px;
        max-height: 100vh;
      }
    }

    <div
        class="c0"
      >
        <div
          class="c1"
        >
          <div
            class="c2 c3"
          >
            <h2
              class="c4 c5"
              color="text"
              font-size="16px"
            >
              Connect Wallet
            </h2>
          </div>
          <button
            aria-label="Close the dialog"
            class="c6 c7"
            scale="md"
          >
            <svg
              class="c8"
              color="primary"
              viewBox="0 0 24 24"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          class="c9 c2 c10"
        >
          <div
            class="c11 c12"
          >
            <div
              class="c13"
            />
          </div>
          <div
            class="c14"
          >
            <p
              class="c15"
              color="textSubtle"
              font-size="16px"
            >
              Haven’t got a crypto wallet yet?
            </p>
            <a
              class="c16"
              href="https://docs.pancakeswap.finance/get-started/connection-guide"
              rel="noreferrer noopener"
              scale="md"
              target="_blank"
              width="100%"
            >
              Learn How to Connect
            </a>
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
