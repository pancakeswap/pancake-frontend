import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { AddIcon, Button, Flex, IconButton, MinusIcon, useModalV2 } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import { useCheckShouldSwitchNetwork } from 'views/universalFarms/hooks'
import { StakeModal } from '../StakeModal'

type ActionPanelProps = {
  removed: boolean
  outOfRange: boolean
  tokenId?: bigint
  isStaked?: boolean
  detailMode?: boolean
  modalContent: React.ReactNode
  currency0: Currency
  currency1: Currency
  protocol: Protocol
  fee: number
}

export const ActionPanel = ({
  currency0,
  currency1,
  isStaked,
  removed,
  outOfRange,
  tokenId,
  modalContent,
  detailMode,
  protocol,
  fee,
}: ActionPanelProps) => {
  const { t } = useTranslation()
  const { onStake, onUnstake, onHarvest, attemptingTxn } = useFarmV3Actions({
    tokenId: tokenId?.toString() ?? '',
    onDone: () => {},
  })
  const stakeModal = useModalV2()
  const { switchNetworkIfNecessary, isLoading: isSwitchingNetwork } = useCheckShouldSwitchNetwork()

  const handleStakeAndCheckInactive = useCallback(async () => {
    logGTMClickStakeFarmEvent()
    if (outOfRange && !isStaked) {
      stakeModal.onOpen()
    } else {
      await switchNetworkIfNecessary(currency0.chainId)
      await onStake()
    }
  }, [isStaked, onStake, outOfRange, stakeModal, switchNetworkIfNecessary, currency0.chainId])

  const handleStake = useCallback(async () => {
    logGTMClickStakeFarmEvent()
    await switchNetworkIfNecessary(currency0.chainId)
    await onStake()
  }, [onStake, switchNetworkIfNecessary, currency0.chainId])

  const handleUnStake = useCallback(async () => {
    await switchNetworkIfNecessary(currency0.chainId)
    await onUnstake()
  }, [onUnstake, switchNetworkIfNecessary, currency0.chainId])

  const handleHarvest = useCallback(async () => {
    await switchNetworkIfNecessary(currency0.chainId)
    await onHarvest()
  }, [onHarvest, switchNetworkIfNecessary, currency0.chainId])

  const preventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  const handleIncreasePosition = useCallback(() => {
    if (protocol === Protocol.V3) {
      window.open(
        `/increase/${currency0.wrapped.address}/${currency1.wrapped.address}/${fee}/${tokenId}`,
        '_blank',
        'noopener',
      )
    }
  }, [currency0.wrapped.address, currency1.wrapped.address, fee, protocol, tokenId])

  const handleDecreasePosition = useCallback(() => {
    if (protocol === Protocol.V3) {
      window.open(
        `/decrease/${currency0.wrapped.address}/${currency1.wrapped.address}/${fee}/${tokenId}`,
        '_blank',
        'noopener',
      )
    }
  }, [currency0.wrapped.address, currency1.wrapped.address, fee, protocol, tokenId])

  const stakeButton = useMemo(
    () => (
      <>
        <Button
          scale="md"
          width={['100px']}
          style={{ alignSelf: 'center' }}
          onClick={handleStakeAndCheckInactive}
          disabled={attemptingTxn || isSwitchingNetwork}
        >
          {t('Stake')}
        </Button>
        <StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onStake={handleStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </StakeModal>
      </>
    ),
    [
      isSwitchingNetwork,
      handleStake,
      handleStakeAndCheckInactive,
      isStaked,
      modalContent,
      t,
      outOfRange,
      stakeModal,
      attemptingTxn,
    ],
  )

  const unstakeButton = useMemo(
    () => (
      <>
        <Button
          scale="md"
          width={['100px']}
          style={{ alignSelf: 'center' }}
          variant="secondary"
          onClick={stakeModal.onOpen}
          disabled={attemptingTxn || isSwitchingNetwork}
        >
          {t('Unstake')}
        </Button>
        <StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onUnStake={handleUnStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </StakeModal>
      </>
    ),
    [isSwitchingNetwork, handleUnStake, isStaked, modalContent, t, outOfRange, stakeModal, attemptingTxn],
  )
  const showLpChangeActions = useMemo(() => {
    if (protocol === Protocol.V3 && isStaked) return false
    return true
  }, [isStaked, protocol])

  if (detailMode) {
    return (
      <ActionPanelContainer onClick={preventDefault}>
        {showLpChangeActions ? (
          <>
            {!removed && (
              <IconButton mr="6px" variant="secondary" onClick={handleDecreasePosition}>
                <MinusIcon color="primary" width="14px" />
              </IconButton>
            )}
            <IconButton variant="secondary" onClick={handleIncreasePosition}>
              <AddIcon color="primary" width="14px" />
            </IconButton>
          </>
        ) : null}
        {isStaked ? unstakeButton : !removed ? stakeButton : null}
        {isStaked && !removed ? (
          <Button width={['100px']} scale="md" disabled={attemptingTxn || isSwitchingNetwork} onClick={handleHarvest}>
            {attemptingTxn ? t('Harvesting') : t('Harvest')}
          </Button>
        ) : null}
      </ActionPanelContainer>
    )
  }
  return (
    <ActionPanelContainer onClick={preventDefault}>
      {!isStaked && !removed ? stakeButton : null}
      {isStaked && !removed ? (
        <Button width={['100px']} scale="md" disabled={attemptingTxn || isSwitchingNetwork} onClick={handleHarvest}>
          {attemptingTxn ? t('Harvesting') : t('Harvest')}
        </Button>
      ) : null}
    </ActionPanelContainer>
  )
}

const ActionPanelContainer = styled(Flex)`
  flex-direction: row;
  gap: 8px;
  height: 48px;

  & button {
    flex: 1;
  }
`
