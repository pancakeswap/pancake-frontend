export enum PredictionSupportedSymbol {
  BNB = 'BNB',
  CAKE = 'CAKE',
  ETH = 'ETH',
  WBTC = 'WBTC',
}

export enum BetPosition {
  BULL = 'Bull',
  BEAR = 'Bear',
  HOUSE = 'House',
}

export enum PredictionStatus {
  INITIAL = 'initial',
  LIVE = 'live',
  PAUSED = 'paused',
  ERROR = 'error',
}

export enum PredictionsChartView {
  TradingView = 'TradingView',
  Chainlink = 'Chainlink Oracle',
}
