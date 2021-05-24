import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, Heading, useModal, Skeleton } from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { VaultFees } from 'hooks/cakeVault/useGetVaultFees'
import { VaultUser } from 'views/Graves/types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import { convertSharesToCake } from '../../../helpers'
import VaultStakeModal from '../VaultStakeModal'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'
import { BIG_TEN } from '../../../../../utils/bigNumber'

interface HasStakeActionProps {
  grave: GraveConfig
  stakingTokenBalance: BigNumber
  zombiePrice: BigNumber
  stakingMax: BigNumber
  userData: any
  account: string
  setLastUpdated: () => void
}

const IsStakedActions: React.FC<HasStakeActionProps> = ({
  grave,
  stakingTokenBalance,
  zombiePrice,
  stakingMax,
  userData,
  account,
  setLastUpdated,
}) => {

  const stakedDollarValue = zombiePrice.times(userData.zombieStaked)

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={tokens.zmbe.symbol} />)

  const zombieAsDisplayBalance = new BigNumber(userData.zombieStaked)

  const [onPresentStake] = useModal(
    <VaultStakeModal
      account={account}
      grave={grave}
      userData={userData}
      stakingMax={stakingMax}
      stakingTokenPrice={zombiePrice}
      setLastUpdated={setLastUpdated}
    />,
  )

  const [onPresentUnstake] = useModal(
    <VaultStakeModal
      account={account}
      grave={grave}
      stakingMax={stakingMax}
      stakingTokenPrice={zombiePrice}
      userData={userData}
      setLastUpdated={setLastUpdated}
      isRemovingStake
    />,
  )

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column">
        <Heading>{zombieAsDisplayBalance.div(BIG_TEN.pow(18))}</Heading>
        <Text fontSize="12px" color="textSubtle">{`~${
          zombiePrice ? stakedDollarValue : <Skeleton mt="1px" height={16} width={64} />
        } USD`}</Text>
      </Flex>
      <Flex>
        <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
          <MinusIcon color="primary" width="24px" />
        </IconButton>
        <IconButton variant="secondary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
          <AddIcon color="primary" width="24px" height="24px" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default IsStakedActions
