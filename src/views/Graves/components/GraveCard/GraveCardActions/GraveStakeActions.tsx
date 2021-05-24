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
  account,
  setLastUpdated,
}) => {
  const zombieStaked = new BigNumber(userData.zombieStaked)
  const { t } = useTranslation()
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={tokens.zmbe.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal
      account={account}
      stakingTokenPrice={zombiePrice}
      stakingMax={stakingMax}
      userData={userData}
      grave={grave}
      setLastUpdated={setLastUpdated}
    />,
  )

  const renderStakeAction = () => {
    return zombieStaked.gt(0) ? (
      <IsStakedActions
        grave={grave}
        userData={userData}
        stakingMax={stakingMax}
        zombiePrice={zombiePrice}
        stakingTokenBalance={zombieStaked}
        account={account}
        setLastUpdated={setLastUpdated}
      />
    ) : (
      <Button onClick={zombieStaked.gt(0) ? onPresentStake : onPresentTokenRequired}>{t('Stake')}</Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default GraveStakeActions
