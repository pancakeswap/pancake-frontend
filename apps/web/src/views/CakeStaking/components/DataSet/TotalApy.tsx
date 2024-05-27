import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { useMemo } from 'react'
import styled from 'styled-components'
import {
  BRIBE_APR,
  useCakePoolEmission,
  useFourYearTotalVeCakeApr,
  useRevShareEmission,
} from 'views/CakeStaking/hooks/useAPR'
import { useVeCakeTotalSupply } from 'views/CakeStaking/hooks/useVeCakeTotalSupply'

const GradientText = styled(Text)`
  font-weight: 600;
  background: linear-gradient(269deg, #1c94e5 7.46%, #0058b9 99.29%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
interface TotalApyProps {
  veCake: string
  cakeAmount: number
  cakeLockWeeks: string
}

export const TotalApy: React.FC<React.PropsWithChildren<TotalApyProps>> = ({ veCake, cakeAmount, cakeLockWeeks }) => {
  const { t } = useTranslation()
  const cakePoolEmission = useCakePoolEmission()
  const revShareEmission = useRevShareEmission()
  const { veCAKEPoolApr, revShareEmissionApr } = useFourYearTotalVeCakeApr()
  const { data: totalSupply } = useVeCakeTotalSupply()
  // CAKE Pool APR
  const userCakeTvl = useMemo(() => getDecimalAmount(new BigNumber(cakeAmount)), [cakeAmount])
  const userSharesPercentage = useMemo(
    () => getDecimalAmount(new BigNumber(veCake)).div(totalSupply).times(100),
    [totalSupply, veCake],
  )

  const shouldShow4yrApr = useMemo(() => cakeAmount === 0 || cakeLockWeeks === '', [cakeAmount, cakeLockWeeks])

  const cakePoolApr = useMemo(() => {
    if (shouldShow4yrApr) {
      return Number(veCAKEPoolApr)
    }

    const apr = new BigNumber(userSharesPercentage)
      .times(cakePoolEmission)
      .div(3)
      .times(24 * 60 * 60 * 365)
      .div(userCakeTvl.div(1e18))
      .toNumber()

    return Number.isNaN(apr) ? 0 : apr
  }, [cakePoolEmission, shouldShow4yrApr, userCakeTvl, userSharesPercentage, veCAKEPoolApr])

  // Revenue Sharing
  const revenueSharingApr = useMemo(() => {
    if (shouldShow4yrApr) {
      return Number(revShareEmissionApr)
    }

    const apr = new BigNumber(userSharesPercentage)
      .times(revShareEmission)
      .times(24 * 60 * 60 * 365)
      .div(userCakeTvl)
      .toNumber()

    return Number.isNaN(apr) ? 0 : apr
  }, [revShareEmission, revShareEmissionApr, shouldShow4yrApr, userCakeTvl, userSharesPercentage])

  // Bribe Apr
  const bribeApr = useMemo(() => {
    if (shouldShow4yrApr) {
      return BRIBE_APR
    }

    return new BigNumber(BRIBE_APR).times(new BigNumber(cakeLockWeeks).div(208)).toNumber()
  }, [cakeLockWeeks, shouldShow4yrApr])

  const totalApy = useMemo(() => {
    const total = new BigNumber(cakePoolApr).plus(revenueSharingApr).plus(bribeApr).toNumber()
    return Number.isNaN(total) ? 0 : total
  }, [bribeApr, cakePoolApr, revenueSharingApr])

  const {
    targetRef: totalAprRef,
    tooltip: totalAprTooltips,
    tooltipVisible: totalAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          🔹{t('Total APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is the sum of veCAKE Pool APR, Revenue sharing APR and Birbes APY from Guages voting.')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/vecake/faq#why-there-are-multiple-aprs">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  const {
    targetRef: veCakePoolAprRef,
    tooltip: veCakePoolAprTooltips,
    tooltipVisible: veCakePoolAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('veCAKE Pool APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is generated from CAKE emission, controlled by the veCAKE Pool gauge.')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/vecake/faq#what-is-vecake-pool-apr">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  const {
    targetRef: revenueSharingPoolAprRef,
    tooltip: revenueSharingPoolAprTooltips,
    tooltipVisible: revenueSharingPoolAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('Revenue Sharing APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is generated from weekly revenue sharing from PancakeSwap V3.')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/vecake/faq#what-is-revenue-sharing-apr">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  const {
    targetRef: bribeAprRef,
    tooltip: bribeAprTooltips,
    tooltipVisible: bribeAprTooltipVisible,
  } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('Bribe APR')}
        </Text>
        <Text ml="4px" as="span">
          {t('is generated from voting incentives on bribe platforms. More info on platform websites:')}
        </Text>
      </Box>
      <Link mt="8px" external href="https://votemarket.stakedao.org/?market=cake&solution=All">
        {t('StakeDAO')}
      </Link>
      <Link mt="8px" external href="https://hiddenhand.finance/pancakeswap">
        {t('Hiddenhand')}
      </Link>
      <Link mt="8px" external href="https://www.pancake.magpiexyz.io/vecake-bribe">
        {t('Cakepie')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  return (
    <Flex width="100%" flexDirection="column">
      <Flex justifyContent="space-between">
        <TooltipText fontSize="14px" color="textSubtle" ref={totalAprRef}>
          {t('Total APR')}
        </TooltipText>
        <Flex>
          <Text>🔹</Text>
          <GradientText>{t('Up to %apr%%', { apr: totalApy.toFixed(2) })} </GradientText>
        </Flex>
      </Flex>
      <Box ml="25px">
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={veCakePoolAprRef}>
            {t('veCAKE Pool APR')}
          </TooltipText>
          {shouldShow4yrApr ? (
            <Text>{t('Up to %apr%%', { apr: cakePoolApr.toFixed(2) })} </Text>
          ) : (
            <Text>{`${cakePoolApr.toFixed(2)}%`} </Text>
          )}
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={revenueSharingPoolAprRef}>
            {t('Revenue Sharing APR')}
          </TooltipText>
          {shouldShow4yrApr ? (
            <Text>{t('Up to %apr%%', { apr: revenueSharingApr.toFixed(2) })} </Text>
          ) : (
            <Text>{`${revenueSharingApr.toFixed(2)}%`} </Text>
          )}
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={bribeAprRef}>
            {t('Bribe APR')}
          </TooltipText>
          {shouldShow4yrApr ? (
            <GradientText>{t('Up to %apr%%', { apr: bribeApr.toFixed(2) })} </GradientText>
          ) : (
            <GradientText>{`${bribeApr.toFixed(2)}%`} </GradientText>
          )}
        </Flex>
      </Box>
      {totalAprTooltipVisible && totalAprTooltips}
      {veCakePoolAprTooltipVisible && veCakePoolAprTooltips}
      {revenueSharingPoolAprTooltipVisible && revenueSharingPoolAprTooltips}
      {bribeAprTooltipVisible && bribeAprTooltips}
    </Flex>
  )
}
