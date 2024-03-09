import { styled } from 'styled-components'

export const Wrapper = styled.div`
  .sgt-adventure__wrapper {
  }
  .sgt-adventure__user {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    height: 24px;
    margin-bottom: 10px;
  }
  .sgt-adventure__user-avatar {
    width: 24px;
    height: 24px;
  }
  .sgt-adventure__user-name {
    font-size: 16px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.72);
  }
  .sgt-adventure__title {
    font-size: 24px;
    font-weight: bold;
    line-height: 24px;
    color: #fff;
    margin-bottom: 12px;
  }
  .sgt-adventure__owner {
    font-size: 12px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.72);
  }
  .sgt-adventure__list {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow-x: auto;
  }
  .sgt-adventure__list-item {
    height: 52px;
  }
  .sgt-adventure__list-item-label {
    font-size: 14px;
    line-height: 22px;
    color: rgba(255, 255, 255, 0.72);
  }
  .sgt-adventure__list-item-value {
    padding-right: 30px;
    margin-top: 4px;
    font-size: 18px;
    font-weight: 800;
    line-height: 26px;
    white-space: nowrap;
  }
  .sgt-adventure__bottom {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .sgt-adventure__modal-fee-line {
    box-sizing: content-box;
    margin-top: 16px;
    padding-bottom: 16px;
    display: flex;
    height: 18px;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 1px solid rgba(74, 74, 76, 1);
    color: rgba(255, 255, 255, 0.48);
    font-size: 14px;
    line-height: 18px;
  }
  .sgt-adventure__modal-total-box {
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 36px;
    align-items: flex-end;
  }
  .sgt-adventure__modal-total-label {
    font-size: 14px;
    font-weight: 700;
    line-height: 21px;
    color: #fff;
  }
  .sgt-adventure__modal-total-value {
    line-height: 36px;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }
`
