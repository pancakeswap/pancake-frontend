import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, Heading, useModal, Skeleton, Button } from '@rug-zombie-libs/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, formatNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Web3 from 'web3'
import { GraveConfig } from '../../../../../config/constants/types'
import tokens from '../../../../../config/constants/tokens'
import { BIG_TEN } from '../../../../../utils/bigNumber'
import GraveWithdrawModal from '../GraveWithdrawModal'

interface HasStakeActionProps {
  grave: GraveConfig
  stakingTokenBalance: BigNumber
  zombiePrice: BigNumber
  stakingMax: BigNumber
  userData: any
  account: string
  web3: Web3
}

const WithdrawAction: React.FC<HasStakeActionProps> = ({
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
  const doneStaking = (Date.now() / 1000) >= userData.withdrawalDate
  const [onPresentUnstake] = useModal(
    <GraveWithdrawModal
      account={account}
      grave={grave}
      stakingMax={new BigNumber(userData.zombieStaked)}
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
         <Button onClick={onPresentUnstake}> {doneStaking ? 'Withdraw' : 'Withdraw Early'}</Button>
       </Flex>
    </Flex>
  )
}

export default WithdrawAction
