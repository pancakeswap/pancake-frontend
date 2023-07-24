import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'
import { Balance, Flex, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { formatBigInt, formatLocalisedCompactNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import { cakeVaultV2ABI } from '@pancakeswap/pools'
import { SLOW_INTERVAL } from 'config/constants'
import { useEffect, useState } from 'react'
import { usePriceCakeUSD } from 'state/farms/hooks'
import styled from 'styled-components'
import useSWR from 'swr'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { useCakeEmissionPerBlock } from 'views/Home/hooks/useCakeEmissionPerBlock'
import { erc20ABI } from 'wagmi'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean; noDesktopBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}

  ${({ noDesktopBorder, theme }) =>
    noDesktopBorder &&
    `${theme.mediaQueries.md} {
           padding: 0;
           border-left: none;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);
  grid-template-areas:
    'a d'
    'b e'
    'c f';

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-areas: 'a b d e f';
    grid-gap: 32px;
    grid-template-columns: repeat(3, auto);
  }
`

/**
 * User (Planet Finance) built a contract on top of our original manual CAKE pool,
 * but the contract was written in such a way that when we performed the migration from Masterchef v1 to v2, the tokens were stuck.
 * These stuck tokens are forever gone (see their medium post) and can be considered out of circulation."
 * https://planetfinanceio.medium.com/pancakeswap-works-with-planet-to-help-cake-holders-f0d253b435af
 * https://twitter.com/PancakeSwap/status/1523913527626702849
 * https://bscscan.com/tx/0xd5ffea4d9925d2f79249a4ce05efd4459ed179152ea5072a2df73cd4b9e88ba7
 */
const planetFinanceBurnedTokensWei = 637407922445268000000000n
const cakeVaultAddress = getCakeVaultAddress()

const CakeDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const emissionsPerBlock = useCakeEmissionPerBlock(loadData)

  const {
    data: { cakeSupply, burnedBalance, circulatingSupply } = {
      cakeSupply: 0,
      burnedBalance: 0,
      circulatingSupply: 0,
    },
  } = useSWR(
    loadData ? ['cakeDataRow'] : null,
    async () => {
      const [totalSupply, burned, totalLockedAmount] = await publicClient({ chainId: ChainId.BSC }).multicall({
        contracts: [
          { abi: erc20ABI, address: bscTokens.cake.address, functionName: 'totalSupply' },
          {
            abi: erc20ABI,
            address: bscTokens.cake.address,
            functionName: 'balanceOf',
            args: ['0x000000000000000000000000000000000000dEaD'],
          },
          {
            abi: cakeVaultV2ABI,
            address: cakeVaultAddress,
            functionName: 'totalLockedAmount',
          },
        ],
        allowFailure: false,
      })
      const totalBurned = planetFinanceBurnedTokensWei + burned
      const circulating = totalSupply - (totalBurned + totalLockedAmount)

      return {
        cakeSupply: totalSupply && burned ? +formatBigInt(totalSupply - totalBurned) : 0,
        burnedBalance: burned ? +formatBigInt(totalBurned) : 0,
        circulatingSupply: circulating ? +formatBigInt(circulating) : 0,
      }
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
  const cakePriceBusd = usePriceCakeUSD()
  const mcap = cakePriceBusd.times(circulatingSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <Grid>
      <Flex flexDirection="column" style={{ gridArea: 'a' }}>
        <Text color="secondary" bold>
          {t('Circulating Supply')}
        </Text>
        {circulatingSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={circulatingSupply} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text color="secondary">{t('Unit')}</Text>
      </Flex>
      <StyledColumn noMobileBorder style={{ gridArea: 'b' }}>
        <Text color="secondary" bold>
          {t('Total supply')}
        </Text>
        {cakeSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={cakeSupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={126} my="4px" />
          </>
        )}
        <Text color="secondary">{t('Unit')}</Text>
      </StyledColumn>
      {/* <StyledColumn noMobileBorder style={{ gridArea: 'c' }}>
        <Text color="textSubtle">{t('Max Supply')}</Text>

        <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={750000000} />
      </StyledColumn> */}
      <StyledColumn noDesktopBorder style={{ gridArea: 'd' }}>
        <Text color="secondary" bold>
          {t('Market cap')}
        </Text>
        {mcap?.gt(0) && mcapString ? (
          <Heading scale="lg">{t('$%marketCap%', { marketCap: mcapString })}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text color="secondary">{t('Unit')}</Text>
      </StyledColumn>
      <StyledColumn style={{ gridArea: 'e' }}>
        <Text color="secondary" bold>
          {t('Burned to date')}
        </Text>
        {burnedBalance ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text color="secondary">{t('Unit')}</Text>
      </StyledColumn>
      <StyledColumn style={{ gridArea: 'f' }}>
        <Text color="secondary" bold>
          {t('Current emissions')}
        </Text>

        {emissionsPerBlock ? (
          <Heading scale="lg">{t('%cakeEmissions%/block', { cakeEmissions: formatNumber(emissionsPerBlock) })}</Heading>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
        <Text color="secondary">{t('Unit')}</Text>
      </StyledColumn>
    </Grid>
  )
}

export default CakeDataRow
