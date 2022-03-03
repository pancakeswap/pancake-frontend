/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { TokenData } from 'state/info/types'
import { infoClient } from 'utils/graphql'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getAmountChange, getChangeForPeriod, getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { getDeltaTimestamps } from 'views/Info/utils/infoQueryHelpers'

interface TokenFields {
  id: string
  symbol: string
  name: string
  derivedBNB: string // Price in BNB per token
  derivedUSD: string // Price in USD per token
  tradeVolumeUSD: string
  totalTransactions: string
  totalLiquidity: string
}

interface FormattedTokenFields
  extends Omit<TokenFields, 'derivedBNB' | 'derivedUSD' | 'tradeVolumeUSD' | 'totalTransactions' | 'totalLiquidity'> {
  derivedBNB: number
  derivedUSD: number
  tradeVolumeUSD: number
  totalTransactions: number
  totalLiquidity: number
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
const TOKEN_AT_BLOCK = (block: number | undefined, tokens: string[]) => {
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
      derivedBNB
      derivedUSD
      tradeVolumeUSD
      totalTransactions
      totalLiquidity
    }
  `
}

const fetchTokenData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  tokenAddresses: string[],
) => {
  try {
    const query = gql`
      query tokens {
        now: ${TOKEN_AT_BLOCK(null, tokenAddresses)}
        oneDayAgo: ${TOKEN_AT_BLOCK(block24h, tokenAddresses)}
        twoDaysAgo: ${TOKEN_AT_BLOCK(block48h, tokenAddresses)}
        oneWeekAgo: ${TOKEN_AT_BLOCK(block7d, tokenAddresses)}
        twoWeeksAgo: ${TOKEN_AT_BLOCK(block14d, tokenAddresses)}
      }
    `
    const data = await infoClient.request<TokenQueryResponse>(query)
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
    const { derivedBNB, derivedUSD, tradeVolumeUSD, totalTransactions, totalLiquidity } = tokenData
    accum[tokenData.id] = {
      ...tokenData,
      derivedBNB: parseFloat(derivedBNB),
      derivedUSD: parseFloat(derivedUSD),
      tradeVolumeUSD: parseFloat(tradeVolumeUSD),
      totalTransactions: parseFloat(totalTransactions),
      totalLiquidity: parseFloat(totalLiquidity),
    }
    return accum
  }, {})
}

interface TokenDatas {
  error: boolean
  data?: {
    [address: string]: TokenData
  }
}

/**
 * Fetch top addresses by volume
 */
const useFetchedTokenDatas = (tokenAddresses: string[]): TokenDatas => {
  const [fetchState, setFetchState] = useState<TokenDatas>({ error: false })
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  useEffect(() => {
    const fetch = async () => {
      const { error, data } = await fetchTokenData(
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        tokenAddresses,
      )
      if (error) {
        setFetchState({ error: true })
      } else {
        const parsed = parseTokenData(data?.now)
        const parsed24 = parseTokenData(data?.oneDayAgo)
        const parsed48 = parseTokenData(data?.twoDaysAgo)
        const parsed7d = parseTokenData(data?.oneWeekAgo)
        const parsed14d = parseTokenData(data?.twoWeeksAgo)

        // Calculate data and format
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
          const [volumeUSDWeek] = getChangeForPeriod(
            current?.tradeVolumeUSD,
            week?.tradeVolumeUSD,
            twoWeeks?.tradeVolumeUSD,
          )
          const liquidityUSD = current ? current.totalLiquidity * current.derivedUSD : 0
          const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedUSD : 0
          const liquidityUSDChange = getPercentChange(liquidityUSD, liquidityUSDOneDayAgo)
          const liquidityToken = current ? current.totalLiquidity : 0
          // Prices of tokens for now, 24h ago and 7d ago
          const priceUSD = current ? current.derivedUSD : 0
          const priceUSDOneDay = oneDay ? oneDay.derivedUSD : 0
          const priceUSDWeek = week ? week.derivedUSD : 0
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
            liquidityUSD,
            liquidityUSDChange,
            liquidityToken,
            priceUSD,
            priceUSDChange,
            priceUSDChangeWeek,
          }

          return accum
        }, {})
        setFetchState({ data: formatted, error: false })
      }
    }
    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (tokenAddresses.length > 0 && allBlocksAvailable && !blockError) {
      fetch()
    }
  }, [tokenAddresses, block24h, block48h, block7d, block14d, blockError])

  return fetchState
}

export default useFetchedTokenDatas
