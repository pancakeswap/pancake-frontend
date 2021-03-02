import BigNumber from 'bignumber.js/bignumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const CAKE_PER_BLOCK = new BigNumber(40)
export const BLOCKS_PER_YEAR = new BigNumber(10512000)
export const BSC_BLOCK_TIME = 3
export const CAKE_POOL_PID = 1
export const BASE_EXCHANGE_URL = 'https://exchange.pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50
export const LOTTERY_TICKET_PRICE = 1

// Env
export const API_PROFILE = process.env.REACT_APP_API_PROFILE
export const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID)
export const CROWDIN_PROJECTID = Number(process.env.REACT_APP_CROWDIN_PROJECTID)
export const CROWDIN_APIKEY = process.env.REACT_APP_CROWDIN_APIKEY
export const NODE_1 = process.env.REACT_APP_NODE_1
export const NODE_2 = process.env.REACT_APP_NODE_2
export const NODE_3 = process.env.REACT_APP_NODE_3
export const NODE_ENV = process.env.REACT_APP_NODE_ENV
export const SUBGRAPH_PROFILE = process.env.REACT_APP_SUBGRAPH_PROFILE
