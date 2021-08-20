/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { getPercentChange, getChangeForPeriod, getAmountChange } from 'utils/infoData'
import { TokenData } from 'state/info/types'
import { useBnbPrices } from 'hooks/useBnbPrices'

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
export const TOKEN_AT_BLOCK = (block: number | undefined, tokens: string[]) => {
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
      tradeVolume
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
    const data = await request<TokenQueryResponse>(INFO_CLIENT, query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch token data', error)
    return { erro: true }
  }
}

// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strigns to numbers
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

interface TokenDatas {
  error: boolean
  data?: {
    [address: string]: TokenData
  }
}

/**
 * Fetch top addresses by volume
 */
export const useFetchedTokenDatas = (tokenAddresses: string[]): TokenDatas => {
  const [fetchState, setFetchState] = useState<TokenDatas>({ error: false })
  const [t24h, t48h, t7d, t14d] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []
  const bnbPrices = useBnbPrices()

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
      }
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
        // if (address === '0x3fcca8648651e5b974dd6d3e50f61567779772a8') {
        //   console.log('POTS')
        //   console.log('bnbPrices.current', bnbPrices.current, current.derivedBNB)
        //   console.log('bnbPrices.oneDay', bnbPrices.oneDay, oneDay.derivedBNB)
        //   console.log({ priceUSD, priceUSDOneDay, priceUSDChange })
        // }
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
      setFetchState({ data: formatted, error: false })
    }
    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (tokenAddresses.length > 0 && allBlocksAvailable && !blockError && bnbPrices) {
      fetch()
    }
  }, [tokenAddresses, block24h, block48h, block7d, block14d, blockError, bnbPrices])

  return fetchState
}
