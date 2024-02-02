import { expect, it, vi } from "vitest";
import BalanceInput from "../../components/BalanceInput/BalanceInput";
import { renderWithProvider } from "../../testHelpers";

const handleChange = vi.fn();

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <BalanceInput value="14" currencyValue="15 USD" onUserInput={handleChange} />
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c2 {
      width: 100%;
    }

    .c1 {
      display: flex;
      justify-content: flex-end;
    }

    .c3 {
      display: flex;
    }

    .c4 {
      display: flex;
      align-items: center;
    }

    .c7 {
      color: var(--colors-textSubtle);
      font-weight: 400;
      line-height: 1.5;
      font-size: 12px;
      text-align: right;
    }

    .c5 {
      background-color: var(--colors-input);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      color: var(--colors-text);
      display: block;
      font-size: 16px;
      height: 40px;
      outline: 0;
      padding: 0 16px;
      width: 100%;
      border: 1px solid var(--colors-inputSecondary);
    }

    .c5::placeholder {
      color: var(--colors-textSubtle);
    }

    .c5:disabled {
      background-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c5:focus:not(:disabled) {
      box-shadow: var(--shadows-focus);
    }

    .c0 {
      background-color: var(--colors-input);
      border: 1px solid var(--colors-inputSecondary);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      padding: 8px 16px;
    }

    .c6 {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      padding-left: 0;
      padding-right: 0;
      text-align: right;
      border: none;
    }

    .c6 ::placeholder {
      color: var(--colors-textSubtle);
    }

    .c6:focus:not(:disabled) {
      box-shadow: none;
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
            <div
              class="c2"
            >
              <div
                class="c4"
              >
                <input
                  class="c5 c6"
                  inputmode="decimal"
                  min="0"
                  pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                  placeholder="0.0"
                  value="14"
                />
              </div>
              <div
                class="c7"
              >
                15 USD
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});

it("renders correctly with unit prop", () => {
  const { asFragment } = renderWithProvider(
    <BalanceInput value="14" currencyValue="15 USD" unit="CAKE" onUserInput={handleChange} />
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c2 {
      width: 100%;
    }

    .c1 {
      display: flex;
      justify-content: flex-end;
    }

    .c3 {
      display: flex;
    }

    .c4 {
      display: flex;
      align-items: center;
    }

    .c7 {
      color: var(--colors-text);
      font-weight: 400;
      line-height: 1.5;
      font-size: 16px;
    }

    .c9 {
      color: var(--colors-textSubtle);
      font-weight: 400;
      line-height: 1.5;
      font-size: 12px;
      text-align: right;
    }

    .c5 {
      background-color: var(--colors-input);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      color: var(--colors-text);
      display: block;
      font-size: 16px;
      height: 40px;
      outline: 0;
      padding: 0 16px;
      width: 100%;
      border: 1px solid var(--colors-inputSecondary);
    }

    .c5::placeholder {
      color: var(--colors-textSubtle);
    }

    .c5:disabled {
      background-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c5:focus:not(:disabled) {
      box-shadow: var(--shadows-focus);
    }

    .c8 {
      margin-left: 4px;
      text-align: right;
      color: var(--colors-textSubtle);
      white-space: nowrap;
    }

    .c0 {
      background-color: var(--colors-input);
      border: 1px solid var(--colors-inputSecondary);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      padding: 8px 16px;
    }

    .c6 {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      padding-left: 0;
      padding-right: 0;
      text-align: right;
      border: none;
    }

    .c6 ::placeholder {
      color: var(--colors-textSubtle);
    }

    .c6:focus:not(:disabled) {
      box-shadow: none;
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
            <div
              class="c2"
            >
              <div
                class="c4"
              >
                <input
                  class="c5 c6"
                  inputmode="decimal"
                  min="0"
                  pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                  placeholder="0.0"
                  value="14"
                />
                <div
                  class="c7 c8"
                >
                  CAKE
                </div>
              </div>
              <div
                class="c9"
              >
                15 USD
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});

it("renders correctly with unit prop and switchEditingUnits", () => {
  const { asFragment } = renderWithProvider(
    <BalanceInput
      value="14"
      currencyValue="15 USD"
      unit="CAKE"
      switchEditingUnits={vi.fn()}
      onUserInput={handleChange}
    />
  );
  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      .c2 {
      width: 100%;
    }

    .c10 {
      padding-left: 12px;
    }

    .c1 {
      display: flex;
      justify-content: flex-end;
    }

    .c3 {
      display: flex;
    }

    .c4 {
      display: flex;
      align-items: center;
    }

    .c14 {
      align-self: center;
      fill: var(--colors-textSubtle);
      color: var(--colors-textSubtle);
      flex-shrink: 0;
    }

    .c7 {
      color: var(--colors-text);
      font-weight: 400;
      line-height: 1.5;
      font-size: 16px;
    }

    .c9 {
      color: var(--colors-textSubtle);
      font-weight: 400;
      line-height: 1.5;
      font-size: 12px;
      text-align: right;
    }

    .c5 {
      background-color: var(--colors-input);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      color: var(--colors-text);
      display: block;
      font-size: 16px;
      height: 40px;
      outline: 0;
      padding: 0 16px;
      width: 100%;
      border: 1px solid var(--colors-inputSecondary);
    }

    .c5::placeholder {
      color: var(--colors-textSubtle);
    }

    .c5:disabled {
      background-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c5:focus:not(:disabled) {
      box-shadow: var(--shadows-focus);
    }

    .c11 {
      position: relative;
      align-items: center;
      border: 0;
      border-radius: 16px;
      box-shadow: 0px -1px 0px 0px rgba(14, 14, 44, 0.4) inset;
      cursor: pointer;
      display: inline-flex;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      justify-content: center;
      letter-spacing: 0.03em;
      line-height: 1;
      opacity: 1;
      outline: 0;
      transition: background-color 0.2s,opacity 0.2s;
      height: 32px;
      padding: 0 16px;
      background-color: transparent;
      color: var(--colors-primary);
      box-shadow: none;
    }

    .c11:focus-visible {
      outline: none;
      box-shadow: var(--shadows-focus);
    }

    .c11:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
      opacity: 0.85;
      transform: translateY(1px);
      box-shadow: none;
    }

    .c11:disabled,
    .c11.pancake-button--disabled {
      background-color: var(--colors-backgroundDisabled);
      border-color: var(--colors-backgroundDisabled);
      box-shadow: none;
      color: var(--colors-textDisabled);
      cursor: not-allowed;
    }

    .c12 {
      padding: 2px;
      width: 32px;
    }

    .c13 {
      width: 16px;
    }

    .c8 {
      margin-left: 4px;
      text-align: right;
      color: var(--colors-textSubtle);
      white-space: nowrap;
    }

    .c0 {
      background-color: var(--colors-input);
      border: 1px solid var(--colors-inputSecondary);
      border-radius: 16px;
      box-shadow: var(--shadows-inset);
      padding: 8px 16px;
    }

    .c6 {
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      padding-left: 0;
      padding-right: 0;
      text-align: right;
      border: none;
    }

    .c6 ::placeholder {
      color: var(--colors-textSubtle);
    }

    .c6:focus:not(:disabled) {
      box-shadow: none;
    }

    @supports (-webkit-text-size-adjust: none) and (not (-ms-accelerator: true)) and (not (-moz-appearance: none)) {
      .c14 {
        filter: none!important;
      }
    }

    @media (hover: hover) {
      .c11:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
        opacity: 0.65;
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
            <div
              class="c2"
            >
              <div
                class="c4"
              >
                <input
                  class="c5 c6"
                  inputmode="decimal"
                  min="0"
                  pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                  placeholder="0.0"
                  value="14"
                />
                <div
                  class="c7 c8"
                >
                  CAKE
                </div>
              </div>
              <div
                class="c9"
              >
                15 USD
              </div>
            </div>
          </div>
          <div
            class="c10 c4"
          >
            <button
              class="c11 c12 c13"
              scale="sm"
              variant="text"
            >
              <svg
                class="c14"
                color="textSubtle"
                viewBox="0 0 24 25"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 17.01V11C16 10.45 15.55 10 15 10C14.45 10 14 10.45 14 11V17.01H12.21C11.76 17.01 11.54 17.55 11.86 17.86L14.65 20.64C14.85 20.83 15.16 20.83 15.36 20.64L18.15 17.86C18.47 17.55 18.24 17.01 17.8 17.01H16ZM8.65003 3.35002L5.86003 6.14002C5.54003 6.45002 5.76003 6.99002 6.21003 6.99002H8.00003V13C8.00003 13.55 8.45003 14 9.00003 14C9.55003 14 10 13.55 10 13V6.99002H11.79C12.24 6.99002 12.46 6.45002 12.14 6.14002L9.35003 3.35002C9.16003 3.16002 8.84003 3.16002 8.65003 3.35002Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </DocumentFragment>
  `);
});
