/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { Block, TokenData } from 'state/info/types'
import { getChangeForPeriod } from 'utils/getChangeForPeriod'
import { getAmountChange, getPercentChange } from 'utils/infoDataHelpers'
import {
  MultiChainNameExtend,
  STABLESWAP_SUBGRAPHS_START_BLOCK,
  checkIsStableSwap,
  getMultiChainQueryEndPointWithStableSwap,
  multiChainQueryMainToken,
} from '../../constant'
import { fetchTokenAddresses } from './topTokens'

interface TokenFields {
  id: string
  symbol: string
  name: string
  decimals: string
  derivedBNB: string // Price in BNB per token
  derivedETH: string // Price in ETH per token
  derivedUSD: string // Price in USD per token
  tradeVolumeUSD: string
  totalTransactions: string
  totalLiquidity: string
}

interface FormattedTokenFields
  extends Omit<
    TokenFields,
    'derivedETH' | 'derivedBNB' | 'derivedUSD' | 'tradeVolumeUSD' | 'totalTransactions' | 'totalLiquidity' | 'decimals'
  > {
  derivedBNB: number
  derivedETH: number
  derivedUSD: number
  tradeVolumeUSD: number
  totalTransactions: number
  totalLiquidity: number
  decimals: number
}

interface TokenQueryResponse {
  now: TokenFields[]
  oneDayAgo: TokenFields[]
  twoDaysAgo: TokenFields[]
  oneWeekAgo: TokenFields[]
  twoWeeksAgo: TokenFields[]
}

/**
 * Main token data to display on Token page
 */
const TOKEN_AT_BLOCK = (chainName: MultiChainNameExtend, block: number | undefined, tokens: string[]) => {
  const addressesString = `["${tokens.join('","')}"]`
  const blockString = block ? `block: {number: ${block}}` : ``
  return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: tradeVolumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      decimals
      derived${multiChainQueryMainToken[chainName]}
      derivedUSD
      tradeVolumeUSD
      totalTransactions
      totalLiquidity
    }
  `
}

const fetchTokenData = async (
  chainName: MultiChainNameExtend,
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  tokenAddresses: string[],
) => {
  const isStableSwap = checkIsStableSwap()
  const startBlock = isStableSwap ? STABLESWAP_SUBGRAPHS_START_BLOCK[chainName] : undefined
  try {
    const query = gql`
      query tokens {
        now: ${TOKEN_AT_BLOCK(chainName, undefined, tokenAddresses)}
        oneDayAgo: ${TOKEN_AT_BLOCK(chainName, block24h, tokenAddresses)}
        ${
          ((Boolean(startBlock) && startBlock <= block48h) || !startBlock) && block48h > 0
            ? `twoDaysAgo: ${TOKEN_AT_BLOCK(chainName, block48h, tokenAddresses)}`
            : ''
        }
        ${
          ((Boolean(startBlock) && startBlock <= block7d) || !startBlock) && block7d > 0
            ? `oneWeekAgo: ${TOKEN_AT_BLOCK(chainName, block7d, tokenAddresses)}`
            : ''
        }
        ${
          ((Boolean(startBlock) && startBlock <= block14d) || !startBlock) && block14d > 0
            ? `twoWeeksAgo: ${TOKEN_AT_BLOCK(chainName, block14d, tokenAddresses)}`
            : ''
        }
      }
    `
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TokenQueryResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch token data', error)
    return { error: true }
  }
}

// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strings to numbers
const parseTokenData = (tokens?: TokenFields[]) => {
  if (!tokens) {
    return {}
  }
  return tokens.reduce((accum: { [address: string]: FormattedTokenFields }, tokenData) => {
    const { derivedBNB, derivedUSD, tradeVolumeUSD, totalTransactions, totalLiquidity, derivedETH, decimals } =
      tokenData
    accum[tokenData.id.toLowerCase()] = {
      ...tokenData,
      derivedBNB: derivedBNB ? 0 : parseFloat(derivedBNB),
      derivedETH: derivedETH ? 0 : parseFloat(derivedETH),
      derivedUSD: parseFloat(derivedUSD),
      tradeVolumeUSD: parseFloat(tradeVolumeUSD),
      totalTransactions: parseFloat(totalTransactions),
      totalLiquidity: parseFloat(totalLiquidity),
      decimals: parseInt(decimals),
    }
    return accum
  }, {})
}

export const fetchAllTokenDataByAddresses = async (
  chainName: MultiChainNameExtend,
  blocks: Block[],
  tokenAddresses: string[],
) => {
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  const { data } = await fetchTokenData(
    chainName,
    block24h?.number ?? 0,
    block48h?.number ?? 0,
    block7d?.number ?? 0,
    block14d?.number ?? 0,
    tokenAddresses,
  )

  const parsed = parseTokenData(data?.now)
  const parsed24 = parseTokenData(data?.oneDayAgo)
  const parsed48 = parseTokenData(data?.twoDaysAgo)
  const parsed7d = parseTokenData(data?.oneWeekAgo)
  const parsed14d = parseTokenData(data?.twoWeeksAgo)

  // Calculate data and format
  const formatted = tokenAddresses.reduce((accum: { [address: string]: { data: TokenData } }, address) => {
    const current: FormattedTokenFields | undefined = parsed[address]
    const oneDay: FormattedTokenFields | undefined = parsed24[address]
    const twoDays: FormattedTokenFields | undefined = parsed48[address]
    const week: FormattedTokenFields | undefined = parsed7d[address]
    const twoWeeks: FormattedTokenFields | undefined = parsed14d[address]

    const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
      current?.tradeVolumeUSD,
      oneDay?.tradeVolumeUSD,
      twoDays?.tradeVolumeUSD,
    )
    const [volumeUSDWeek] = getChangeForPeriod(current?.tradeVolumeUSD, week?.tradeVolumeUSD, twoWeeks?.tradeVolumeUSD)
    const liquidityUSD = current ? current.totalLiquidity * current.derivedUSD : 0
    const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0
    const liquidityUSDChange = getPercentChange(liquidityUSD, liquidityUSDOneDayAgo)
    const liquidityToken = current ? current.totalLiquidity : 0
    // Prices of tokens for now, 24h ago and 7d ago
    const priceUSD = current ? current.derivedUSD : 0
    const decimals = current ? current.decimals : 0
    const priceUSDOneDay = oneDay ? oneDay.derivedUSD : 0
    const priceUSDWeek = week ? week.derivedUSD : 0
    const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
    const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)
    const txCount = getAmountChange(current?.totalTransactions, oneDay?.totalTransactions)

    accum[address] = {
      data: {
        exists: !!current,
        address,
        name: current ? current.name : '',
        symbol: current ? current.symbol : '',
        volumeUSD,
        volumeUSDChange,
        volumeUSDWeek,
        txCount,
        liquidityUSD,
        liquidityUSDChange,
        liquidityToken,
        priceUSD,
        priceUSDChange,
        priceUSDChangeWeek,
        decimals,
      },
    }
    return accum
  }, {})

  return formatted
}

export const fetchAllTokenData = async (chainName: MultiChainNameExtend, blocks: Block[]) => {
  const tokenAddresses = await fetchTokenAddresses(chainName)
  const data = await fetchAllTokenDataByAddresses(chainName, blocks, tokenAddresses)
  return data
}
