import React from 'react'
import styled from 'styled-components'
import { Heading, Flex, LogoIcon, Text, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useGetStats } from 'hooks/api'
import Balance from 'components/Balance'

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
  const tvlString = data
    ? data.tvl.toLocaleString('en-US', { maximumSignificantDigits: 1, maximumFractionDigits: 0 })
    : '-'
  const tvlText = t('And those users are now entrusting the platform with over %tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <StyledLogoIcon height="48px" width="48px" mb="24px" />
      <Heading scale="xl"> {t('Used by millions.')}</Heading>
      <Heading scale="xl" mb="32px">
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
            <Text textAlign="center" color="textSubtle" mb="20px" mx="4px">
              ${tvlString}
            </Text>
          ) : (
            <Skeleton height={14} width={106} m="4px" />
          )}
        </>
        <Text textAlign="center" color="textSubtle" mb="20px">
          {inFunds}
        </Text>
      </Flex>

      <Text textAlign="center" color="textSubtle" bold>
        {t('Will you join them?')}
      </Text>
    </Flex>
  )
}

export default Stats
