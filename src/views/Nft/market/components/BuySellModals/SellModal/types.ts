export enum SellingStage {
  // Sell flow
  SELL,
  SET_PRICE,
  APPROVE_AND_CONFIRM_SELL,
  // Adjust price flow
  EDIT,
  ADJUST_PRICE,
  CONFIRM_ADJUST_PRICE,
  // Remove from market flow
  REMOVE_FROM_MARKET,
  CONFIRM_REMOVE_FROM_MARKET,
  // Transfer flow
  TRANSFER,
  CONFIRM_TRANSFER,
  // Common
  TX_CONFIRMED,
}
