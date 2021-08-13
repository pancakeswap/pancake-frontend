import React from 'react'
import { Flex, Button, useModal, Skeleton } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BigNumber } from 'bignumber.js'
import Web3 from 'web3'
import GraveStakeModal from '../GraveStakeModal'
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
  web3: Web3
}

const GraveStakeActions: React.FC<VaultStakeActionsProps> = ({
  grave,
  userData,
  zombiePrice,
  stakingMax,
  isLoading = false,
  balances,
  account,
  web3
}) => {
  const zombieBalance = new BigNumber(balances.zombie)
  const { t } = useTranslation()
  const [onPresentStake] = useModal(
    <GraveStakeModal
      account={account}
      stakingTokenPrice={zombiePrice}
      stakingMax={stakingMax}
      userData={userData}
      grave={grave}
      web3={web3}
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
        web3={web3}
      />
    ) : (
      <Button onClick={onPresentStake}>{t('Stake')}</Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default GraveStakeActions
