import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, useMatchBreakpoints, useModal, IconButton, AddIcon, MinusIcon } from '@pancakeswap/uikit'
import { DeserializedPool } from 'state/types'
import { useERC20 } from 'hooks/useContract'
import { PoolCategory } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { convertSharesToCake } from 'views/Pools/helpers'
import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from 'views/Pools/hooks/useApprove'
import NotEnoughTokensModal from 'views/Pools/components/PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from 'views/Pools/components/PoolCard/Modals/StakeModal'
import VaultStakeModal from 'views/Pools/components/CakeVaultCard/VaultStakeModal'

const IconButtonWrapper = styled.div`
  display: flex;
`
export interface StakeButtonProps {
  pool: DeserializedPool
}

const StakeButton: React.FC<StakeButtonProps> = ({ pool }) => {
  const { sousId, stakingToken, earningToken, isFinished, poolCategory, userData, stakingTokenPrice, vaultKey } = pool
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()
  const { handleApprove: handleVaultApprove, pendingTx: pendingVaultTx } = useVaultApprove(setLastUpdated)

  const pendingTx = vaultKey ? pendingVaultTx : pendingPoolTx

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const {
    userData: { userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { cakeAsBigNumber } = convertSharesToCake(userShares, pricePerFullShare)
  const hasSharesStaked = userShares && userShares.gt(0)
  const isVaultWithShares = vaultKey && hasSharesStaked

  const needsApproval = vaultKey ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const handleApprove = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (vaultKey) {
      handleVaultApprove()
    } else {
      handlePoolApprove()
    }
  }

  const handleStake = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (stakingTokenBalance.gt(0)) {
      onStake()
    } else {
      onPresentTokenRequired()
    }
  }

  const onStake = () => {
    if (vaultKey) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const handleUnstake = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  if (needsApproval) {
    return (
      <Button
        disabled={pendingTx}
        onClick={handleApprove}
        variant="tertiary"
        marginLeft="auto"
        width={isDesktop ? '142px' : '120px'}
      >
        {t('Enable')}
      </Button>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    return (
      <IconButtonWrapper>
        <IconButton variant="secondary" onClick={handleUnstake} mr="6px">
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton variant="secondary" onClick={handleStake} disabled={isFinished}>
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Button width={isDesktop ? '142px' : '120px'} onClick={handleStake} marginLeft="auto" disabled={isFinished}>
      {t('Stake')}
    </Button>
  )
}

export default StakeButton
