import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { useMemo } from 'react'
import styled from 'styled-components'
import { BRIBE_APR, useCakePoolEmission, useRevShareEmission } from 'views/CakeStaking/hooks/useAPR'
import { useVeCakeTotalSupply } from 'views/CakeStaking/hooks/useVeCakeTotalSupply'

const GradientText = styled(Text)`
  font-weight: 600;
  background: linear-gradient(269deg, #1c94e5 7.46%, #0058b9 99.29%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const TotalApy = ({ veCake, cakeAmount }: { veCake: string; cakeAmount: number }) => {
  const { t } = useTranslation()
  const cakePoolEmission = useCakePoolEmission()
  const revShareEmission = useRevShareEmission()
  const { data: totalSupply } = useVeCakeTotalSupply()
  // CAKE Pool APR
  const userCakeTvl = getDecimalAmount(new BigNumber(cakeAmount))
  const userSharesPercentage = getDecimalAmount(new BigNumber(veCake)).div(totalSupply).times(100)

  const cakePoolApr = useMemo(() => {
    const apr = new BigNumber(userSharesPercentage)
      .times(cakePoolEmission)
      .div(3)
      .times(24 * 60 * 60 * 365)
      .div(userCakeTvl.div(1e18))
      .toNumber()

    return Number.isNaN(apr) ? 0 : apr
  }, [cakePoolEmission, userCakeTvl, userSharesPercentage])

  // Revenue Sharing
  const revenueSharingApr = useMemo(() => {
    const apr = new BigNumber(userSharesPercentage)
      .times(revShareEmission)
      .times(24 * 60 * 60 * 365)
      .div(userCakeTvl)
      .toNumber()

    return Number.isNaN(apr) ? 0 : apr
  }, [revShareEmission, userCakeTvl, userSharesPercentage])

  const totalApy = useMemo(
    () => new BigNumber(cakePoolApr).plus(revenueSharingApr).plus(BRIBE_APR).toNumber(),
    [cakePoolApr, revenueSharingApr],
  )

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
          <Text>{`${cakePoolApr.toFixed(2)}%`}</Text>
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={revenueSharingPoolAprRef}>
            {t('Revenue Sharing APR')}
          </TooltipText>
          <Text>{`${revenueSharingApr.toFixed(2)}%`}</Text>
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={bribeAprRef}>
            {t('Bribe APR')}
          </TooltipText>
          <GradientText>{`${BRIBE_APR.toFixed(2)}%`}</GradientText>
        </Flex>
      </Box>
      {totalAprTooltipVisible && totalAprTooltips}
      {veCakePoolAprTooltipVisible && veCakePoolAprTooltips}
      {revenueSharingPoolAprTooltipVisible && revenueSharingPoolAprTooltips}
      {bribeAprTooltipVisible && bribeAprTooltips}
    </Flex>
  )
}
