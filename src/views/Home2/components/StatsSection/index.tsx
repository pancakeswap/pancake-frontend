import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Heading, Flex, LogoIcon, Text, Skeleton, ChartIcon, CommunityIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import useTheme from 'hooks/useTheme'
import formatLocalisedCompactNumber from 'utils/formatLocalisedCompactNumber'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import { getUsersAndTrades } from './helpers'

const StyledLogoIcon = styled(LogoIcon)`
  path {
    fill: ${({ theme }) => theme.colors.secondary};

    &.left-eye,
    &.right-eye {
      fill: ${({ theme }) => theme.colors.background};
    }
  }
`

const Stats = () => {
  const { t } = useTranslation()
  const data = useGetStats()
  const { theme } = useTheme()
  const [users, setUsers] = useState('-')
  const [trades, setTrades] = useState('-')

  const tvlString = data ? formatLocalisedCompactNumber(data.tvl) : '-'

  useEffect(() => {
    const fetchTradeData = async () => {
      const { addressCount, txCount } = await getUsersAndTrades()
      const txCountString = txCount ? formatLocalisedCompactNumber(txCount) : '-'
      const addressCountString = addressCount ? formatLocalisedCompactNumber(addressCount) : '-'
      setTrades(txCountString)
      setUsers(addressCountString)
    }

    fetchTradeData()
  }, [])

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
    background: theme.colors.background,
    borderColor: theme.colors.cardBorder,
  }

  const TradesCardData: IconCardData = {
    icon: <ChartIcon color="primary" width="36px" />,
    background: theme.colors.background,
    borderColor: theme.colors.cardBorder,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="36px" />,
    background: theme.colors.background,
    borderColor: theme.colors.cardBorder,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <StyledLogoIcon height="48px" width="48px" mb="24px" />
      <Heading textAlign="center" scale="xl">
        {t('Used by millions.')}
      </Heading>
      <Heading textAlign="center" scale="xl" mb="32px">
        {t('Trusted with billions.')}
      </Heading>
      <Text textAlign="center" color="textSubtle">
        {t('PancakeSwap has the most users of any decentralized platform, ever.')}
      </Text>
      <Flex flexWrap="wrap">
        <Text textAlign="center" color="textSubtle" mb="20px">
          {entrusting}
        </Text>
        <>
          {data ? (
            <Text textAlign="center" color="textSubtle" mb="20px" mr="4px">
              {tvlString}
            </Text>
          ) : (
            <Skeleton height={14} width={106} m="4px" />
          )}
        </>
        <Text textAlign="center" color="textSubtle" mb="20px">
          {inFunds}
        </Text>
      </Flex>

      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('Will you join them?')}
      </Text>

      <Flex flexDirection={['column', null, null, 'row']}>
        <IconCard {...UsersCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('%users% users', { users })}
            bodyText={t('in the last 30 days')}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('%trades% trades', { trades })}
            bodyText={t('made in the last 30 days')}
            highlightColor={theme.colors.primary}
          />
        </IconCard>
        <IconCard {...StakedCardData}>
          <StatCardContent
            headingText={t('$%tvl% staked', { tvl: tvlString })}
            bodyText={t('Total Value Locked')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
      </Flex>
    </Flex>
  )
}

export default Stats
