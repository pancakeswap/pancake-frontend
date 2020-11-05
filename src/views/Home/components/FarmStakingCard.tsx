import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, Button } from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import useModal from 'hooks/useModal'
import { useAllReward } from 'hooks/useReward'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import WalletProviderModal from 'components/WalletProviderModal'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/cake-bg.svg');
  background-repeat: no-repeat;
  background-position: top right;
  margin-left: auto;
  margin-right: auto;
  max-width: 344px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardTitle = styled(Heading).attrs({ size: 'lg' })`
  margin-bottom: 24px;
`
const Block = styled.div`
  margin-bottom: 16px;
`

const Value = styled.div`
  margin-bottom: 8px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter(
    (balanceType) => balanceType.balance.toNumber() > 0,
  )

  const { onReward } = useAllReward(
    balancesWithValue.map((farmWithBalance) => farmWithBalance.pid),
  )
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <StyledFarmStakingCard>
      <CardTitle>{TranslateString(999, 'Farms & Staking')}</CardTitle>
      <CardImage src="/images/cake.svg" alt="cake logo" />
      <Block>
        <Value>
          <CakeHarvestBalance />
        </Value>
        <Label>{TranslateString(999, 'CAKE to Harvest')}</Label>
      </Block>
      <Block>
        <Value>
          <CakeWalletBalance />
        </Value>
        <Label>{TranslateString(999, 'CAKE in Wallet')}</Label>
      </Block>
      <Actions>
        {account ? (
          <Button
            disabled={balancesWithValue.length <= 0 || pendingTx}
            onClick={harvestAllFarms}
            fullWidth
          >
            {pendingTx
              ? TranslateString(999, 'Collecting CAKE')
              : TranslateString(
                  999,
                  `Harvest all (${balancesWithValue.length})`,
                )}
          </Button>
        ) : (
          <Button fullWidth onClick={handleUnlockClick}>
            {TranslateString(292, 'Unlock Wallet')}
          </Button>
        )}
      </Actions>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
