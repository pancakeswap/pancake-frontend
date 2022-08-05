import React from "react";
import noop from "lodash/noop";
import { renderWithTheme } from "../../testHelpers";
import ConnectModal from "../../widgets/WalletModal/ConnectModal";

it("renders ConnectModal correctly", () => {
  const { asFragment } = renderWithTheme(<ConnectModal login={noop} t={(key: string) => key} />);
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c0 {
      min-width: 320px;
    }

    .c10 {
      min-width: 320px;
    }

    .c12 {
      max-height: 453px;
      overflow-y: auto;
      padding-top: 24px;
      padding-bottom: 24px;
    }

    .c20 {
      padding: 24px;
    }

    .c14 {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .c5 {
      color: #280D5F;
      font-weight: 600;
      line-height: 1.5;
      font-size: 16px;
    }

    .c18 {
      color: #280D5F;
      font-weight: 400;
      line-height: 1.5;
      font-size: 14px;
    }

    .c21 {
      color: #7A6EAA;
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 16px;
      text-align: center;
      font-size: 16px;
    }

    .c6 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.1;
    }

    .c7 {
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
      color: #1FC7D4;
      box-shadow: none;
    }

    .c7:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c7:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c7:disabled,
    .c7.pancake-button--disabled {
      background-color: #E9EAEB;
      border-color: #E9EAEB;
      box-shadow: none;
      color: #BDC2C4;
      cursor: not-allowed;
    }

    .c15 {
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
      color: #1FC7D4;
      box-shadow: none;
      width: 100%;
      padding-top: 16px;
      padding-bottom: 16px;
    }

    .c15:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c15:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c15:disabled,
    .c15.pancake-button--disabled {
      background-color: #E9EAEB;
      border-color: #E9EAEB;
      box-shadow: none;
      color: #BDC2C4;
      cursor: not-allowed;
    }

    .c22 {
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
      background-color: #7A6EAA;
      color: #FFFFFF;
      width: 100%;
    }

    .c22:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
      opacity: 0.65;
    }

    .c22:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }

    .c22:disabled,
    .c22.pancake-button--disabled {
      background-color: #E9EAEB;
      border-color: #E9EAEB;
      box-shadow: none;
      color: #BDC2C4;
      cursor: not-allowed;
    }

    .c8 {
      padding: 0;
      width: 48px;
    }

    .c9 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: #1FC7D4;
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
    }

    .c17 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: #280D5F;
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      margin-bottom: 8px;
    }

    .c19 {
      -webkit-align-self: center;
      -ms-flex-item-align: center;
      align-self: center;
      fill: #7A6EAA;
      -webkit-flex-shrink: 0;
      -ms-flex-negative: 0;
      flex-shrink: 0;
      margin-bottom: 8px;
    }

    .c3 {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .c2 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: linear-gradient(139.73deg,#E5FDFF 0%,#F3EFFF 100%);
      border-bottom: 1px solid #E7E3EB;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding: 12px 24px;
    }

    .c4 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }

    .c11 {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      max-height: 90vh;
      max-height: calc(var(--vh,1vh) * 90);
      overflow-y: auto;
    }

    .c1 {
      overflow: hidden;
      background: #FFFFFF;
      box-shadow: 0px 20px 36px -8px rgba(14,14,44,0.1),0px 1px 1px rgba(0,0,0,0.05);
      border: 1px solid #E7E3EB;
      border-radius: 32px;
      width: 100%;
      max-height: 100vh;
      max-height: calc(var(--vh,1vh) * 100);
      z-index: 100;
    }

    .c16 {
      -webkit-align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      height: auto;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
    }

    .c13 {
      border-bottom: 1px solid #E7E3EB;
    }

    @media screen and (min-width:370px) {

    }

    @media screen and (min-width:576px) {
      .c10 {
        min-width: 340px;
      }
    }

    @media screen and (min-width:968px) {
      .c6 {
        font-size: 20px;
      }
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c9 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c17 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    @supports (-webkit-text-size-adjust:none) and (not (-ms-accelerator:true)) and (not (-moz-appearance:none)) {
      .c19 {
        -webkit-filter: none !important;
        filter: none !important;
      }
    }

    @media screen and (min-width:370px) {
      .c1 {
        width: auto;
        min-width: 320px;
        max-width: 100%;
      }
    }

    <div
        class="c0 c1"
      >
        <div
          class="c2"
        >
          <div
            class="c3 c4"
          >
            <h2
              class="c5 c6"
              color="text"
              font-size="16px"
            >
              Connect Wallet
            </h2>
          </div>
          <button
            aria-label="Close the dialog"
            class="c7 c8"
            scale="md"
          >
            <svg
              class="c9"
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
          class="c10 c3 c11"
        >
          <div
            class="c12 c13"
          >
            <div
              class="c14"
            >
              <div
                class=""
              >
                <button
                  class="c15 c16"
                  id="wallet-connect-metamask"
                  scale="md"
                  width="100%"
                >
                  <svg
                    class="c17"
                    color="text"
                    viewBox="0 0 40 40"
                    width="40px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M36.0112 3.33337L22.1207 13.6277L24.7012 7.56091L36.0112 3.33337Z"
                      fill="#E17726"
                    />
                    <path
                      d="M4.00261 3.33337L17.7558 13.7238L15.2989 7.56091L4.00261 3.33337Z"
                      fill="#E27625"
                    />
                    <path
                      d="M31.0149 27.2023L27.3227 32.8573L35.2287 35.0397L37.4797 27.3258L31.0149 27.2023Z"
                      fill="#E27625"
                    />
                    <path
                      d="M2.53386 27.3258L4.77116 35.0397L12.6772 32.8573L8.9987 27.2023L2.53386 27.3258Z"
                      fill="#E27625"
                    />
                    <path
                      d="M12.2518 17.6496L10.0419 20.9712L17.8793 21.3281L17.6048 12.8867L12.2518 17.6496Z"
                      fill="#E27625"
                    />
                    <path
                      d="M27.762 17.6494L22.3129 12.7905L22.1207 21.3279L29.9581 20.9711L27.762 17.6494Z"
                      fill="#E27625"
                    />
                    <path
                      d="M12.6772 32.8574L17.3989 30.5652L13.336 27.3809L12.6772 32.8574Z"
                      fill="#E27625"
                    />
                    <path
                      d="M22.6009 30.5652L27.3226 32.8574L26.6637 27.3809L22.6009 30.5652Z"
                      fill="#E27625"
                    />
                    <path
                      d="M27.3226 32.8575L22.6009 30.5653L22.9715 33.6399L22.9303 34.9301L27.3226 32.8575Z"
                      fill="#D5BFB2"
                    />
                    <path
                      d="M12.6772 32.8575L17.0694 34.9301L17.042 33.6399L17.3989 30.5653L12.6772 32.8575Z"
                      fill="#D5BFB2"
                    />
                    <path
                      d="M17.1518 25.3495L13.2262 24.1965L15.9988 22.92L17.1518 25.3495Z"
                      fill="#233447"
                    />
                    <path
                      d="M22.848 25.3495L24.001 22.92L26.801 24.1965L22.848 25.3495Z"
                      fill="#233447"
                    />
                    <path
                      d="M12.6773 32.8573L13.3635 27.2023L8.99876 27.3258L12.6773 32.8573Z"
                      fill="#CC6228"
                    />
                    <path
                      d="M26.6364 27.2023L27.3227 32.8573L31.0149 27.3258L26.6364 27.2023Z"
                      fill="#CC6228"
                    />
                    <path
                      d="M29.9581 20.9709L22.1207 21.3278L22.8482 25.3495L24.0011 22.92L26.8012 24.1965L29.9581 20.9709Z"
                      fill="#CC6228"
                    />
                    <path
                      d="M13.2263 24.1965L15.9989 22.92L17.1519 25.3495L17.8793 21.3278L10.0419 20.9709L13.2263 24.1965Z"
                      fill="#CC6228"
                    />
                    <path
                      d="M10.0419 20.9709L13.3361 27.3809L13.2263 24.1965L10.0419 20.9709Z"
                      fill="#E27525"
                    />
                    <path
                      d="M26.8011 24.1965L26.6638 27.3809L29.958 20.9709L26.8011 24.1965Z"
                      fill="#E27525"
                    />
                    <path
                      d="M17.8793 21.3278L17.1519 25.3494L18.0715 30.0985L18.2637 23.8396L17.8793 21.3278Z"
                      fill="#E27525"
                    />
                    <path
                      d="M22.1205 21.3278L21.7499 23.8258L21.9283 30.0985L22.848 25.3494L22.1205 21.3278Z"
                      fill="#E27525"
                    />
                    <path
                      d="M22.848 25.3496L21.9284 30.0987L22.601 30.5654L26.6638 27.381L26.8011 24.1967L22.848 25.3496Z"
                      fill="#F5841F"
                    />
                    <path
                      d="M13.2262 24.1967L13.336 27.381L17.3989 30.5654L18.0714 30.0987L17.1518 25.3496L13.2262 24.1967Z"
                      fill="#F5841F"
                    />
                    <path
                      d="M22.9303 34.93L22.9715 33.6398L22.6284 33.3378H17.3714L17.042 33.6398L17.0694 34.93L12.6772 32.8574L14.2145 34.1202L17.3302 36.2751H22.6696L25.7853 34.1202L27.3226 32.8574L22.9303 34.93Z"
                      fill="#C0AC9D"
                    />
                    <path
                      d="M22.601 30.5653L21.9284 30.0986H18.0715L17.3989 30.5653L17.0421 33.6399L17.3715 33.3379H22.6285L22.9716 33.6399L22.601 30.5653Z"
                      fill="#161616"
                    />
                    <path
                      d="M36.5875 14.3003L37.7542 8.61779L36.011 3.33337L22.6009 13.2846L27.7618 17.6493L35.0365 19.7768L36.6424 17.8964L35.9424 17.3886L37.0679 16.3728L36.2169 15.7003L37.3287 14.863L36.5875 14.3003Z"
                      fill="#763E1A"
                    />
                    <path
                      d="M2.24573 8.61779L3.42615 14.3003L2.67123 14.863L3.78302 15.7003L2.93202 16.3728L4.05753 17.3886L3.35752 17.8964L4.96343 19.7768L12.2518 17.6493L17.399 13.2846L4.00263 3.33337L2.24573 8.61779Z"
                      fill="#763E1A"
                    />
                    <path
                      d="M35.0365 19.777L27.7619 17.6495L29.958 20.9712L26.6638 27.3811L31.0149 27.3262H37.4797L35.0365 19.777Z"
                      fill="#F5841F"
                    />
                    <path
                      d="M12.2517 17.6495L4.96332 19.777L2.53386 27.3262H8.99869L13.336 27.3811L10.0419 20.9712L12.2517 17.6495Z"
                      fill="#F5841F"
                    />
                    <path
                      d="M22.1205 21.3276L22.6009 13.2843L24.701 7.56067H15.2988L17.3988 13.2843L17.8792 21.3276L18.0577 23.8531L18.0714 30.0984H21.9283L21.9421 23.8531L22.1205 21.3276Z"
                      fill="#F5841F"
                    />
                  </svg>
                  <div
                    class="c18"
                    color="text"
                    font-size="14px"
                  >
                    Metamask
                  </div>
                </button>
              </div>
              <div
                class=""
              >
                <button
                  class="c15 c16"
                  id="wallet-connect-binance wallet"
                  scale="md"
                  width="100%"
                >
                  <svg
                    class="c17"
                    color="text"
                    viewBox="0 0 40 40"
                    width="40px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.2487 9.59637L10.7888 7.58546L20.1999 2.08337L29.6387 7.58546L26.1787 9.59637L20.1999 6.13313L14.2487 9.59637ZM32.1022 13.0596V17.1094L35.5622 15.0985V11.0487L32.1022 9.00986L28.6422 11.0208L32.1022 13.0596ZM16.7399 11.0487L20.1999 13.0596L23.6599 11.0487L20.1999 9.00986L16.7399 11.0487ZM29.6387 14.5119L26.1787 12.501L20.1999 15.9643L14.2487 12.501L10.7888 14.5119V18.5617L16.7399 22.0249V28.9514L20.1999 30.9623L23.6599 28.9514V22.0249L29.6387 18.5617V14.5119ZM32.1022 26.9405L26.1511 30.4038V34.4535L35.5899 28.9514V17.9752L32.1022 20.014V26.9405ZM26.1511 27.527L29.611 25.5161V21.4384L26.1511 23.4493V27.527ZM16.7399 31.8561V35.9058L20.1999 37.9168L23.6599 35.9058V31.8561L20.1999 33.867L16.7399 31.8561ZM4.80992 15.0985L8.2699 17.1094V13.0596L11.7299 11.0487L8.29758 9.00986L4.8376 11.0208V15.0985H4.80992ZM8.29758 20.014L4.8376 18.0031V28.9794L14.2764 34.4814V30.4317L8.29758 26.9405V20.014ZM14.2487 23.4773L10.7888 21.4664V25.5161L14.2487 27.527V23.4773Z"
                      fill="#F1BA0D"
                    />
                  </svg>
                  <div
                    class="c18"
                    color="text"
                    font-size="14px"
                  >
                    Binance Wallet
                  </div>
                </button>
              </div>
              <div
                class=""
              >
                <button
                  class="c15 c16"
                  id="wallet-connect-coinbase wallet"
                  scale="md"
                  width="100%"
                >
                  <svg
                    class="c17"
                    color="text"
                    viewBox="0, 0, 400,400"
                    width="40px"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill-rule="evenodd"
                      stroke="none"
                    >
                      <path
                        d="M193.4 60.265C87.303 66.651 25.782 181.12 79.826 271.586c57.163 95.688 198.154 89.201 246.382-11.336C371.654 165.512 297.595 53.993 193.4 60.265m47.221 95.946c1.213.75 2.418 1.955 3.168 3.168l1.211 1.958v77.326l-1.211 1.958c-.75 1.213-1.955 2.418-3.168 3.168L238.663 245h-77.326l-1.958-1.211c-1.213-.75-2.418-1.955-3.168-3.168L155 238.663l-.119-37.831c-.08-25.344.018-38.306.297-39.267.685-2.365 2.559-4.562 4.876-5.717l2.127-1.06 38.241.106 38.241.106 1.958 1.211"
                        fill="#fbfbfc"
                      />
                      <path
                        d="M183.6.43C41.847 12.741-42.613 163.705 21.396 290.354c49.819 98.572 170.31 138.107 268.958 88.25 98.572-49.819 138.107-170.31 88.25-268.958C348.052 49.197 290.688 9.389 222 .97c-6.325-.775-31.6-1.13-38.4-.54M218 60.975c81.04 11.263 135.239 87.02 119.351 166.825-15.844 79.589-97.673 129.334-175.893 106.929-74.141-21.237-117.409-99.181-96.187-173.271C81.09 106.232 129.39 66.081 186.8 60.433c5.76-.567 25.716-.22 31.2.542m-57.4 94.781c-1.92.838-3.855 2.682-4.648 4.427-.974 2.145-1.175 76.834-.213 79.13.828 1.974 2.657 3.923 4.444 4.735 2.145.974 76.834 1.175 79.13.213 1.974-.828 3.923-2.657 4.735-4.444.974-2.145 1.175-76.834.213-79.13-.828-1.974-2.657-3.923-4.444-4.735-2.115-.96-77.043-1.146-79.217-.196"
                        fill="#0454fc"
                      />
                      <path
                        d="M181.5 155.1c10.175.059 26.825.059 37 0 10.175-.06 1.85-.108-18.5-.108s-28.675.048-18.5.108M154.992 200c0 20.35.048 28.675.108 18.5.059-10.175.059-26.825 0-37-.06-10.175-.108-1.85-.108 18.5m90 0c0 20.35.048 28.675.108 18.5.059-10.175.059-26.825 0-37-.06-10.175-.108-1.85-.108 18.5M181.5 245.1c10.175.059 26.825.059 37 0 10.175-.06 1.85-.108-18.5-.108s-28.675.048-18.5.108"
                        fill="#5286fc"
                      />
                      <path
                        d="M192.7 60.282a5.661 5.661 0 001.8 0c.495-.095.09-.173-.9-.173s-1.395.078-.9.173m12.8 0a5.661 5.661 0 001.8 0c.495-.095.09-.173-.9-.173s-1.395.078-.9.173M60.109 193.6c0 .99.078 1.395.173.9a5.661 5.661 0 000-1.8c-.095-.495-.173-.09-.173.9m279.6 0c0 .99.078 1.395.173.9a5.661 5.661 0 000-1.8c-.095-.495-.173-.09-.173.9m-279.6 12.8c0 .99.078 1.395.173.9a5.661 5.661 0 000-1.8c-.095-.495-.173-.09-.173.9m279.6 0c0 .99.078 1.395.173.9a5.661 5.661 0 000-1.8c-.095-.495-.173-.09-.173.9m-238.926 92.5c1.658 1.766 2.017 2.084 2.017 1.783 0-.064-.855-.919-1.9-1.9L99 297l1.783 1.9m198.017.1c-.972.99-1.677 1.8-1.567 1.8.11 0 .995-.81 1.967-1.8.972-.99 1.677-1.8 1.567-1.8-.11 0-.995.81-1.967 1.8m-106.1 40.882a5.661 5.661 0 001.8 0c.495-.095.09-.173-.9-.173s-1.395.078-.9.173m12.8 0a5.661 5.661 0 001.8 0c.495-.095.09-.173-.9-.173s-1.395.078-.9.173"
                        fill="#84acfc"
                      />
                      <path
                        d="M100.786 101.1l-2.186 2.3 2.3-2.186c2.137-2.032 2.483-2.414 2.186-2.414-.062 0-1.097 1.035-2.3 2.3M298.8 101c1.195 1.21 2.263 2.2 2.373 2.2.11 0-.778-.99-1.973-2.2-1.195-1.21-2.263-2.2-2.373-2.2-.11 0 .778.99 1.973 2.2"
                        fill="#7cacfc"
                      />
                    </g>
                  </svg>
                  <div
                    class="c18"
                    color="text"
                    font-size="14px"
                  >
                    Coinbase Wallet
                  </div>
                </button>
              </div>
              <button
                class="c15 c16"
                scale="md"
                width="100%"
              >
                <svg
                  class="c19"
                  color="textSubtle"
                  viewBox="0 0 24 24"
                  width="40px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                  />
                </svg>
                <div
                  class="c18"
                  color="text"
                  font-size="14px"
                >
                  More
                </div>
              </button>
            </div>
          </div>
          <div
            class="c20"
          >
            <p
              class="c21"
              color="textSubtle"
              font-size="16px"
            >
              Haven’t got a crypto wallet yet?
            </p>
            <a
              class="c22"
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
