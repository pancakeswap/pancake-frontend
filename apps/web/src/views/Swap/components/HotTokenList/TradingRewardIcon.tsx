import { Flex, Box, Text, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ComputedFarmConfigV3 } from '@pancakeswap/farms'

interface TradingRewardIconProps {
  pairs: ComputedFarmConfigV3[]
}

const TradingRewardIcon = ({ pairs }: TradingRewardIconProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    router.push('/trading-reward')
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Flex flexDirection="column" width={300}>
      <Text bold>{t('This token contains trading pair(s) eligible for earning CAKE by trading:')}</Text>
      <Flex flexDirection="column">
        {pairs.map((pair) => (
          <Text key={pair.lpAddress} bold as="li">{`${pair.lpSymbol} - ${pair.feeAmount / 10000}%`}</Text>
        ))}
      </Flex>
      <Text mt="10px">
        <Text bold as="span">
          {t('Trade now or check out the campaign page to learn more')}
        </Text>
        <Text style={{ cursor: 'pointer' }} bold as="span" color="primary" ml="4px" onClick={handleClick}>
          {t('learn more')}
        </Text>
      </Text>
    </Flex>,
    {
      placement: 'top',
    },
  )

  return (
    <Box width={24} height={24} mr="4px">
      <Image width={24} height={24} ref={targetRef} alt="token-reward-icon" src="/images/swap/token-reward-icon.png" />
      {tooltipVisible && tooltip}
    </Box>
  )
}

export default TradingRewardIcon
