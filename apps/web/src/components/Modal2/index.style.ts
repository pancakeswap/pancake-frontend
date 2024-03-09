import styled from 'styled-components'

export const Wrapper = styled.div`
  .modal__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100vw;
    height: 100vh;
  }
  .modal__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .modal__container {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    min-width: 462px;
    transform: translate(-50%, -50%);
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.48);
    background: linear-gradient(0deg, #1c1c1e, #1c1c1e),
      linear-gradient(0deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.48));
    border-radius: 8px;
  }
  .modal__header {
    position: relative;
    height: 32px;
  }
  .modal__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 32px;
    text-align: center;
    color: #fff;
  }
  .modal__close {
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    box-sizing: border-box;
    padding: 10px 2px 10px 18px;
    cursor: pointer;
  }
  .modal__body {
    margin-top: 32px;
  }
  .modal__bottom {
    padding-top: 32px;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
`
