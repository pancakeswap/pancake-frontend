import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { Button, Flex, useModalV2 } from '@pancakeswap/uikit'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import { useCheckShouldSwitchNetwork } from 'views/universalFarms/hooks'
import { Protocol, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { V3StakeModal } from '../Modals/V3StakeModal'

type ActionPanelProps = {
  removed: boolean
  outOfRange: boolean
  tokenId?: bigint
  isStaked?: boolean
  detailMode?: boolean
  modalContent: React.ReactNode
  currency0: Currency
  currency1: Currency
  fee: number
  chainId: number
}

export const V3PositionActions = ({
  chainId,
  currency0,
  currency1,
  isStaked,
  removed,
  outOfRange,
  tokenId,
  modalContent,
  detailMode,
  fee,
}: ActionPanelProps) => {
  const { t } = useTranslation()
  const { onStake, onUnstake, onHarvest, attemptingTxn } = useFarmV3Actions({
    tokenId: tokenId?.toString() ?? '',
    onDone: () => {},
  })
  const stakeModal = useModalV2()
  const { switchNetworkIfNecessary, isLoading: isSwitchingNetwork } = useCheckShouldSwitchNetwork()
  const isFarmLive = useMemo(() => {
    const [token0, token1] = currency0.wrapped.sortsBefore(currency1.wrapped)
      ? [currency0.wrapped, currency1.wrapped]
      : [currency1.wrapped, currency0.wrapped]
    return UNIVERSAL_FARMS.find((farm) => {
      const [farmToken0, farmToken1] = farm.token0.sortsBefore(farm.token1)
        ? [farm.token0, farm.token1]
        : [farm.token1, farm.token0]
      return (
        farm.chainId === chainId &&
        farm.protocol === Protocol.V3 &&
        token0.equals(farmToken0) &&
        token1.equals(farmToken1) &&
        fee === farm.feeAmount
      )
    })
  }, [chainId, currency0, currency1, fee])

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
    window.open(
      `/increase/${currency0.wrapped.address}/${currency1.wrapped.address}/${fee}/${tokenId}`,
      '_blank',
      'noopener',
    )
  }, [currency0.wrapped.address, currency1.wrapped.address, fee, tokenId])

  const handleDecreasePosition = useCallback(() => {
    window.open(
      `/decrease/${currency0.wrapped.address}/${currency1.wrapped.address}/${fee}/${tokenId}`,
      '_blank',
      'noopener',
    )
  }, [currency0.wrapped.address, currency1.wrapped.address, fee, tokenId])

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
        <V3StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onStake={handleStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </V3StakeModal>
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
        <V3StakeModal
          isOpen={stakeModal.isOpen}
          staking={outOfRange && !isStaked}
          onUnStake={handleUnStake}
          onDismiss={stakeModal.onDismiss}
        >
          {modalContent}
        </V3StakeModal>
      </>
    ),
    [isSwitchingNetwork, handleUnStake, isStaked, modalContent, t, outOfRange, stakeModal, attemptingTxn],
  )

  if (detailMode) {
    return (
      <ActionPanelContainer onClick={preventDefault}>
        {/* {isStaked ? (
          <>
            <IconButton mr="6px" variant="secondary" disabled={removed} onClick={handleDecreasePosition}>
              <MinusIcon color="primary" width="14px" />
            </IconButton>
            <IconButton variant="secondary" onClick={handleIncreasePosition}>
              <AddIcon color="primary" width="14px" />
            </IconButton>
          </>
        ) : null} */}
        {isStaked ? unstakeButton : !removed && isFarmLive ? stakeButton : null}
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
      {!isStaked && !removed && isFarmLive ? stakeButton : null}
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
