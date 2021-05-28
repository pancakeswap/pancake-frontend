import React from 'react'
import { Flex, Button, useModal, Skeleton } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BigNumber } from 'bignumber.js'
import Web3 from 'web3'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import GraveStakeModal from '../GraveStakeModal'
import IsStakedActions from './IsStakedActions'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'
import GraveDepositRugModal from '../GraveDepositRugModal'
import IsRugDepositedActions from './IsRugDepositedActions'

interface VaultStakeActionsProps {
  grave: GraveConfig
  userData: any
  ruggedTokenPrice: BigNumber
  stakingMax: BigNumber
  balances: any
  isLoading?: boolean
  account: string
  setLastUpdated: () => void
  web3: Web3
}

const GraveDepositRugAction: React.FC<VaultStakeActionsProps> = ({
  grave,
  userData,
  ruggedTokenPrice,
  stakingMax,
  isLoading = false,
  balances,
  account,
  web3
}) => {
  const ruggedTokenBalance = new BigNumber(balances.ruggedToken)
  const { t } = useTranslation()
  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={grave.ruggedToken.symbol} />)
  const [onPresentStake] = useModal(
    <GraveDepositRugModal
      account={account}
      stakingTokenPrice={ruggedTokenPrice}
      stakingMax={stakingMax}
      userData={userData}
      grave={grave}
      web3={web3}
    />,
  )

  const renderStakeAction = () => {
    return ruggedTokenBalance.gt(0) ? (
      <IsRugDepositedActions
        grave={grave}
        userData={userData}
        stakingMax={stakingMax}
        zombiePrice={ruggedTokenPrice}
        stakingTokenBalance={ruggedTokenBalance}
        account={account}
        web3={web3}
      />
    ) : (
      <Button onClick={ruggedTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>{t('Stake')}</Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default GraveDepositRugAction
