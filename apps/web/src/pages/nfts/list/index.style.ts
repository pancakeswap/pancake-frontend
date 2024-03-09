import { styled } from 'styled-components'

export const Wrapper = styled.div`
  .nft-list__wrapper {
    margin-top: 24px;
    padding: 0px 50px;
  }
  .nft-list__wrapper div::-webkit-scrollbar {
    display: none;
  }
  .nft-list__collection {
    box-sizing: border-box;
    padding: 32px;
    /* width: 1340px; */
    border-radius: 8px;
    height: 144px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #1c1c1e;
    border: 1px solid #3a3a3c;
    overflow: hidden;
  }
  .nft-list__collection-total-box {
    flex-shrink: 0;
    width: 360px;
    height: 80px;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
  .nft-list__collection-icon {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    /* border: 1px solid #fff; */
  }
  .nft-list__collection-total {
  }
  .nft-list__collection-name {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
    color: #fff;
  }
  .nft-list__collection-icon-list {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
  .nft-list__collection-icon-item {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
  }
  .nft-list__collection-table {
    flex: 1;
    overflow-x: auto;
    /* width: 900px; */
    height: 52px;
  }
  .nft-list__table {
    overflow-x: auto;
  }
  .nft-list__game-image {
    box-sizing: border-box;
    width: 56px;
    height: 56px;
    border-radius: 4px;
    border: 1px solid #fff;
  }
  .nft-list__game-name {
    margin-left: 16px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #fff;
  }
  .nft-list__icon {
    margin-left: 4px;
    width: 20px;
    height: 20px;
  }
`
