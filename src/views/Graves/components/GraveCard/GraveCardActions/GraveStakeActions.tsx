import React from 'react'
import { Flex, Button, useModal, Skeleton } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BigNumber } from 'bignumber.js'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'
import IsStakedActions from './IsStakedActions'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'

interface VaultStakeActionsProps {
  grave: GraveConfig
  userData: any
  zombiePrice: BigNumber
  stakingMax: BigNumber
  balances: any
  isLoading?: boolean
  account: string
  setLastUpdated: () => void
}

const GraveStakeActions: React.FC<VaultStakeActionsProps> = ({
  grave,
  userData,
  zombiePrice,
  stakingMax,
  isLoading = false,
  balances,
  account,
  setLastUpdated,
}) => {
  console.log(balances.zombie)
  const zombieBalance = new BigNumber(balances.zombie)
  const { t } = useTranslation()
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={tokens.zmbe.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal
      account={account}
      stakingTokenPrice={zombiePrice}
      stakingMax={stakingMax}
      userData={userData}
      grave={grave}
    />,
  )

  const renderStakeAction = () => {
    return zombieBalance.gt(0) ? (
      <IsStakedActions
        grave={grave}
        userData={userData}
        stakingMax={stakingMax}
        zombiePrice={zombiePrice}
        stakingTokenBalance={zombieBalance}
        account={account}
      />
    ) : (
      <Button onClick={zombieBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>{t('Stake')}</Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : <div />}</Flex>
}

export default GraveStakeActions
