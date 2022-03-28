import { Flex, Text, Skeleton, Box } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import Balance from 'components/Balance'
import { memo } from 'react'
import styled from 'styled-components'

const DetailSection = ({ title, value, detail }) => (
  <Box>
    <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
      {title}
    </Text>
    <Text color="text" textTransform="uppercase" bold fontSize="16px">
      {value}
    </Text>
    <Text color="text" fontSize="12px">
      {detail}
    </Text>
  </Box>
)

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const StakingApy = memo(({ action }) => {
  const { t } = useTranslation()

  const maxLockDuration = useVaultMaxDuration()
  const { lockedApy } = useVaultApy({ duration: maxLockDuration?.toNumber() })

  return (
    <LightGreyCard>
      <Flex justifyContent="space-between" mb="16px">
        <DetailSection title="CAKE LOCKED" value={12000} detail="~424 USD" />
        <DetailSection title="LOCKED DURATION" value="2 weeks" detail="Until 18th May 2022" />
      </Flex>
      <Box mb="16px">{action}</Box>
      <Divider />
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('APY')}
        </Text>
        {lockedApy ? (
          <Balance color="text" bold fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Recent CAKE profit')}
        </Text>
        <Balance color="text" bold fontSize="16px" value={1200} decimals={2} unit="$" />
      </Flex>
    </LightGreyCard>
  )
})

export default StakingApy
