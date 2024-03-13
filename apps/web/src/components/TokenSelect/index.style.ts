import styled from 'styled-components'

export const Wrapper = styled.div`
  .token-select__wrapper {
    height: 36px;
    border-radius: 18px;
    background: #4a4a4c;
    display: flex;
    flex-direction: row;
  }
  .token-select__selected {
    padding: 0 16px 0 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }
  .token-select__selected-icon {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  .token-select__selected-name {
    font-size: 16px;
    line-height: 20px;
    color: #fff;
  }
  .token-select__selected-arrow {
    width: 20px;
    height: 20px;
    transform-origin: center;
    transform: rotate(90deg);
  }
`
