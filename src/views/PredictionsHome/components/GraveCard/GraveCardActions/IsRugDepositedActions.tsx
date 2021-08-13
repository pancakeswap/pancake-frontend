import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, Heading, useModal, Skeleton } from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, formatNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Web3 from 'web3'
import GraveStakeModal from '../GraveStakeModal'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'
import { BIG_TEN } from '../../../../../utils/bigNumber'
import GraveDepositRugModal from '../GraveDepositRugModal'

interface HasStakeActionProps {
  grave: GraveConfig
  stakingTokenBalance: BigNumber
  zombiePrice: BigNumber
  stakingMax: BigNumber
  userData: any
  account: string
  web3: Web3
}

const IsRugDepositedActions: React.FC<HasStakeActionProps> = ({
  grave,
  stakingTokenBalance,
  zombiePrice,
  stakingMax,
  userData,
  account,
  web3
}) => {

  const stakedDollarValue = getFullDisplayBalance(zombiePrice.times(userData.zombieStaked), tokens.zmbe.decimals)

  const zombieAsDisplayBalance = new BigNumber(userData.zombieStaked)

  const [onPresentStake] = useModal(
    <GraveDepositRugModal
      account={account}
      grave={grave}
      userData={userData}
      stakingMax={stakingMax}
      stakingTokenPrice={zombiePrice}
      web3={web3}
    />,
  )

  const [onPresentUnstake] = useModal(
    <GraveStakeModal
      account={account}
      grave={grave}
      stakingMax={stakingMax}
      stakingTokenPrice={zombiePrice}
      userData={userData}
      isRemovingStake
      web3={web3}
    />,
  )

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column">
        <Heading>{zombieAsDisplayBalance.div(BIG_TEN.pow(18)).toString()}</Heading>
        <Text fontSize="12px" color="textSubtle">{`~${
          zombiePrice ? stakedDollarValue : <Skeleton mt="1px" height={16} width={64} />
        } USD`}</Text>
      </Flex>
       <Flex>
        <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
          <MinusIcon color="primary" width="24px" />
        </IconButton>
        <IconButton variant="secondary" onClick={onPresentStake}>
          <AddIcon color="primary" width="24px" height="24px" />
        </IconButton>
       </Flex>
    </Flex>
  )
}

export default IsRugDepositedActions
