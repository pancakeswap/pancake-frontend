import { styled } from 'styled-components'

export const Wrapper = styled.div`
  .price-input__wrapper {
  }
  .price-input__label-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 19px;
  }
  .price-input__label {
    font-size: 14px;
    line-height: 19px;
    color: rgba(255, 255, 255, 0.72);
  }
  .price-input__balance-box {
    display: flex;
    flex-direction: row;
    gap: 4px;
    height: 19px;
  }
  .price-input__balance-label {
    font-size: 12px;
    line-height: 19px;
    color: rgba(255, 255, 255, 0.48);
  }
  .price-input__balance-value {
    font-size: 12px;
    font-weight: 500;
    line-height: 19px;
    color: #fff;
  }
  .price-input__input-box {
    margin-top: 8px;
    box-sizing: border-box;
    border: 1px solid rgba(74, 74, 76, 1);
    background: linear-gradient(0deg, #2c2c2e, #2c2c2e), linear-gradient(0deg, #4a4a4c, #4a4a4c);
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 12px;
    height: 70px;
  }
  .price-input__wrapper--error .price-input__input-box {
    border: 1px solid rgba(245, 99, 90, 1);
  }
  .price-input__input {
    flex: 1;
    font-size: 24px;
    font-weight: 500;
    height: 26px;
    line-height: 26px;
    color: rgba(255, 255, 255, 1);
    background-color: transparent;
    outline: none;
    border: none;
  }

  .price-input__input-suffix {
    margin-left: 8px;
  }
  .price-input__error-box {
    margin-top: 8px;
    height: 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .price-input__error-icon {
    width: 14px;
    height: 18px;
  }
  .price-input__error-msg {
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    color: rgba(245, 99, 90, 1);
  }
`
