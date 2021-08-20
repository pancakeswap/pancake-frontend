/* eslint-disable no-param-reassign */
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { getPercentChange, getChangeForPeriod, getAmountChange } from 'utils/infoData'
import { TokenData } from 'state/info/types'
import { useBnbPrices } from 'hooks/useBnbPrices'

/**
 * Main token data to display on Token page
 */
export const TOKENS_BULK = (block: number | undefined, tokens: string[]) => {
  const addressesString = `["${tokens.join('","')}"]`
  const blockString = block ? `block: {number: ${block}}` : ``
  const queryString = `
    query tokens {
      tokens(
        where: {id_in: ${addressesString}}
        ${blockString}
        orderBy: tradeVolumeUSD
        orderDirection: desc
      ) {
        id
        symbol
        name
        derivedBNB
        derivedUSD
        tradeVolumeUSD
        tradeVolume
        totalTransactions
        totalLiquidity
      }
    }
    `
  return gql(queryString)
}

interface TokenFields {
  id: string
  symbol: string
  name: string
  derivedBNB: string // Price in BNB per token
  derivedUSD: string // Price in USD per token
  tradeVolumeUSD: string
  tradeVolume: string // TODO: remove?
  totalTransactions: string
  totalLiquidity: string
}

interface FormattedTokenFields
  extends Omit<
    TokenFields,
    'derivedBNB' | 'derivedUSD' | 'tradeVolumeUSD' | 'tradeVolume' | 'totalTransactions' | 'totalLiquidity'
  > {
  derivedBNB: number
  derivedUSD: number
  tradeVolumeUSD: number
  tradeVolume: number
  totalTransactions: number
  totalLiquidity: number
}

interface TokenDataResponse {
  tokens: TokenFields[]
  bundles: {
    ethPriceUSD: string // TODO: remove?
  }[]
}

// Transforms pools into "0xADDRESS: { ...PoolFields }" format and cast strigns to numbers
const parseTokenData = (tokens?: TokenFields[]) => {
  if (!tokens) {
    return {}
  }
  return tokens.reduce((accum: { [address: string]: FormattedTokenFields }, tokenData) => {
    const { derivedBNB, derivedUSD, tradeVolumeUSD, tradeVolume, totalTransactions, totalLiquidity } = tokenData
    accum[tokenData.id] = {
      ...tokenData,
      derivedBNB: parseFloat(derivedBNB),
      derivedUSD: parseFloat(derivedUSD),
      tradeVolumeUSD: parseFloat(tradeVolumeUSD),
      tradeVolume: parseFloat(tradeVolume),
      totalTransactions: parseFloat(totalTransactions),
      totalLiquidity: parseFloat(totalLiquidity),
    }
    return accum
  }, {})
}

/**
 * Fetch top addresses by volume
 */
export const useFetchedTokenDatas = (
  tokenAddresses: string[],
): {
  loading: boolean
  error: boolean
  data:
    | {
        [address: string]: TokenData
      }
    | undefined
} => {
  // get blocks from historic timestamps
  const [t24h, t48h, t7d, t14d] = useDeltaTimestamps()

  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []
  const bnbPrices = useBnbPrices()

  const skip = tokenAddresses.length === 0

  const { loading, error, data } = useQuery<TokenDataResponse>(TOKENS_BULK(undefined, tokenAddresses), {
    fetchPolicy: 'no-cache',
    skip,
  })

  const {
    loading: loading24,
    error: error24,
    data: data24,
  } = useQuery<TokenDataResponse>(TOKENS_BULK(parseInt(block24h?.number), tokenAddresses), { skip })

  const {
    loading: loading48,
    error: error48,
    data: data48,
  } = useQuery<TokenDataResponse>(TOKENS_BULK(parseInt(block48h?.number), tokenAddresses), { skip })

  const {
    loading: loading7d,
    error: error7d,
    data: data7d,
  } = useQuery<TokenDataResponse>(TOKENS_BULK(parseInt(block7d?.number), tokenAddresses), { skip })

  const {
    loading: loading14d,
    error: error14d,
    data: data14d,
  } = useQuery<TokenDataResponse>(TOKENS_BULK(parseInt(block14d?.number), tokenAddresses), { skip })

  const anyError = Boolean(error || error24 || error48 || error7d || error14d || blockError)
  const anyLoading = Boolean(loading || loading24 || loading48 || loading7d || loading14d || !blocks)

  if (!bnbPrices) {
    return {
      loading: true,
      error: false,
      data: undefined,
    }
  }

  // return early if not all data yet
  if (anyError || anyLoading) {
    return {
      loading: anyLoading,
      error: anyError,
      data: undefined,
    }
  }

  const parsed = parseTokenData(data?.tokens)
  const parsed24 = parseTokenData(data24?.tokens)
  const parsed48 = parseTokenData(data48?.tokens)
  const parsed7d = parseTokenData(data7d?.tokens)
  const parsed14d = parseTokenData(data14d?.tokens)

  // format data and calculate daily changes
  const formatted = tokenAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
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
    const tvlUSD = current ? current.totalLiquidity * current.derivedUSD : 0
    const tvlUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0
    const tvlUSDChange = getPercentChange(tvlUSD, tvlUSDOneDayAgo)
    const tvlToken = current ? current.totalLiquidity : 0
    // Prices of tokens for now, 24h ago and 7d ago
    const priceUSD = current ? current.derivedBNB * bnbPrices.current : 0
    const priceUSDOneDay = oneDay ? oneDay.derivedBNB * bnbPrices.oneDay : 0
    const priceUSDWeek = week ? week.derivedBNB * bnbPrices.week : 0
    const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
    const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)
    const txCount = getAmountChange(current?.totalTransactions, oneDay?.totalTransactions)

    accum[address] = {
      exists: !!current,
      address,
      name: current ? current.name : '',
      symbol: current ? current.symbol : '',
      volumeUSD,
      volumeUSDChange,
      volumeUSDWeek,
      txCount,
      tvlUSD,
      tvlUSDChange,
      tvlToken,
      priceUSD,
      priceUSDChange,
      priceUSDChangeWeek,
    }

    return accum
  }, {})

  return {
    loading: anyLoading,
    error: anyError,
    data: formatted,
  }
}
