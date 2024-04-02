import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useFourYearTotalVeCakeApr } from 'views/CakeStaking/hooks/useAPR'

const GradientText = styled(Text)`
  font-weight: 600;
  background: linear-gradient(269deg, #1c94e5 7.46%, #0058b9 99.29%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const TotalApy = () => {
  const { t } = useTranslation()
  const { totalApr } = useFourYearTotalVeCakeApr()

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
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/gaming-platform">
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
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/gaming-platform">
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
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/gaming-platform">
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
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/gaming-platform">
        {t('StakeDAO')}
      </Link>
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/gaming-platform">
        {t('Cakepie')}
      </Link>
      <Link mt="8px" external href="https://docs.pancakeswap.finance/products/gaming-platform">
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
          <GradientText>{t('Up to %apr%%', { apr: totalApr.toFixed(2) })} </GradientText>
        </Flex>
      </Flex>
      <Box ml="25px">
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={veCakePoolAprRef}>
            {t('veCAKE Pool APR')}
          </TooltipText>
          <Text>123</Text>
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={revenueSharingPoolAprRef}>
            {t('Revenue Sharing APR')}
          </TooltipText>
          <Text>123</Text>
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <TooltipText fontSize="14px" color="textSubtle" ref={bribeAprRef}>
            {t('Bribe APR')}
          </TooltipText>
          <GradientText>12.3%</GradientText>
        </Flex>
      </Box>
      {totalAprTooltipVisible && totalAprTooltips}
      {veCakePoolAprTooltipVisible && veCakePoolAprTooltips}
      {revenueSharingPoolAprTooltipVisible && revenueSharingPoolAprTooltips}
      {bribeAprTooltipVisible && bribeAprTooltips}
    </Flex>
  )
}
