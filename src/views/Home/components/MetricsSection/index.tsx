import React from 'react'
import { Heading, Flex, Text, CommunityIcon, SwapIcon } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
// import { useGetStats } from 'hooks/api'
import useTheme from 'hooks/useTheme'
// import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import GradientLogo from '../GradientLogoSvg'

// Values fetched from bitQuery effective 6/9/21
// const txCount = 30841921
// const addressCount = 2751624

const Stats = () => {
  const { t } = useTranslation()
  // const data = useGetStats()
  const { theme } = useTheme()

  // const tvlString = data ? formatLocalisedCompactNumber(data.tvl) : '-'
  // const trades = formatLocalisedCompactNumber(txCount)
  // const users = formatLocalisedCompactNumber(addressCount)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  // const StakedCardData: IconCardData = {
  //   icon: <ChartIcon color="failure" width="36px" />,
  // }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <GradientLogo height="auto" width="30vh" mb="24px" />
      <Heading textAlign="center" scale="xl">
        {t('The currency of the people.')}
      </Heading>
      <Heading textAlign="center" scale="xl" mb="32px">
        {t('Managed by the people.')}
      </Heading>
      <Text textAlign="center" color="textSubtle">
        {t('Defi platform to operate with Peronio')}
      </Text>
      <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          {t('100% National without state')}
        </Text>
      </Flex>

      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('Starting point:')}
      </Text>

      <Flex flexDirection={['column', null, null, 'row']}>
        <IconCard {...UsersCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('USD 1 = PE 250')}
            bodyText={t('initial emission')}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('PE 1 = ARS 0.80')}
            bodyText={t('gave the peso a handicap')}
            highlightColor={theme.colors.primary}
          />
        </IconCard>
        <IconCard {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('15% Interest')}
            bodyText={t('Provided by MAI/USDC in QiDao')}
            highlightColor={theme.colors.primary}
          />
        </IconCard>
      </Flex>
    </Flex>
  )
}

export default Stats
