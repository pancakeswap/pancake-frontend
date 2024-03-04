import { styled } from 'styled-components'

export const Wrapper = styled.div`
  .sgt-detail__wrapper {
    padding: 24px 24px 36px;
    height: calc(100vh - 88px);
    display: flex;
    flex-direction: row;
    gap: 8px;
    color: #fff;
  }
  .sgt-detail__left {
    position: relative;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 22px 16px 16px;
    width: 604px;
    flex-shrink: 0;
    box-shadow: 0px 4px 48px 0px rgba(0, 0, 0, 1);
    border: 1px solid rgba(58, 58, 60, 1);
    border-radius: 8px;
    background-color: rgba(28, 28, 30, 1);
  }

  .sgt-detail__left-image-box {
    border: 1px solid rgba(74, 74, 76, 1);
    border-radius: 8px;
    width: 100%;
  }
  .sgt-detail__left-image {
    overflow: hidden;
    width: 100%;
    height: auto;
    border: 1px solid rgba(74, 74, 76, 1);
    border-radius: 8px;
  }

  .sgt-detail__left-trait-box {
    margin-top: 16px;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px 20px;
    background-color: #2c2c2e;
    width: 572px;
  }
  .sgt-detail__left-trait-title-box {
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  .sgt-detail__left-trait-title {
    color: white;
  }
  .sgt-detail__left-trait-title-value {
    color: rgba(255, 255, 255, 0.48);
  }
  .sgt-detail__left-trait-list {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
  }
  .sgt-detail__left-trait-item {
    width: 166px;
    height: 104px;
    display: flex;
    padding-top: 12px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
    background: #3a3a3c;
  }
  .sgt-detail__left-trait-item-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.72);
  }
  .sgt-detail__left-trait-item-short-box {
    font-size: 16px;
    line-height: 24px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    color: rgba(255, 255, 255, 0.95);
  }
  /* .sgt-detail__left-trait-item-short-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.72);
} */
  .sgt-detail__left-trait-item-floor-box {
    font-size: 16px;
    line-height: 24px;
    display: flex;
    flex-direction: row;
    gap: 4px;
    color: rgba(255, 255, 255, 0.72);
  }

  .sgt-detail__left-detail-box {
    margin-top: 16px;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 16px 24px 16px;
    background-color: #2c2c2e;
    width: 572px;
  }
  .sgt-detail__left-detail-title-box {
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  .sgt-detail__left-detail-title {
    color: white;
  }
  .sgt-detail__left-detail-desc {
    margin-top: 12px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    font-size: 14px;
    line-height: 25px;
    color: rgba(255, 255, 255, 0.72);
    border-bottom: 1px solid rgba(255, 255, 255, 0.48);
  }
  .sgt-detail__left-detail-line-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;
    height: 21px;
    gap: 24px;
  }
  .sgt-detail__left-detail-line-babel {
    width: 114px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 14px;
    line-height: 21px;
  }
  .sgt-detail__left-detail-line-value {
    color: rgba(255, 255, 255, 0.95);
    font-size: 14px;
    line-height: 21px;
  }

  /* right */
  .sgt-detail__right {
    width: 780px;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 16px;
    width: 780px;
    /* flex: 8; */
    flex-shrink: 0;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 1);
    border: 1px solid rgba(58, 58, 60, 1);
    border-radius: 8px;
    background-color: rgba(28, 28, 30, 1);
  }
  .sgt-detail__right-block {
    margin-bottom: 16px;
    padding: 16px 20px;
    border-radius: 8px;
    background: #2c2c2e;
  }
  .sgt-detail__right-block-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }

  .sgt-detail__modal-label {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #fff;
  }
  .modal-label__modal-conclusion {
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
  .modal-label__modal-available-box {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .modal-label__modal-available-value {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
  }
  .modal-label__modal-available-unit {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
  }
  .modal-label__modal-total-box {
    display: flex;
    flex-direction: row;
    height: 24px;
    gap: 8px;
  }
  .modal-label__modal-total-label {
    font-size: 14px;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.72);
  }
  .modal-label__modal-total-value {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #fff;
  }
  .modal-label__modal-line {
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 18px;
    color: rgba(255, 255, 255, 0.48);
  }
`
