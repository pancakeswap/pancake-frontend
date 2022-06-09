import styled from 'styled-components'
import { useState, useCallback } from 'react'
import { Flex, Box, Card, Text, useMatchBreakpoints, TokenPairImage } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCardHeaderTitle } from 'views/Pools/components/PoolCard/PoolCardHeader'
import { GreyCard } from 'components/Card'

const CardHeader = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
  border-bottom: solid 2px ${({ theme }) => theme.colors.cardBorder};
`

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  border-bottom: solid 2px ${({ theme }) => theme.colors.cardBorder};
`

const Deposit: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <CardHeader>
        <PoolCardHeaderTitle title="Syrup Pot" subTitle="Stake CAKE, Earn CAKE, Win CAKE" />
        <TokenPairImage
          primarySrc="/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg"
          secondarySrc="/images/tokens/pot-icon.svg"
          width={64}
          height={64}
        />
      </CardHeader>
      <Container>
        <GreyCard>12313</GreyCard>
      </Container>
    </Box>
  )
}

export default Deposit
