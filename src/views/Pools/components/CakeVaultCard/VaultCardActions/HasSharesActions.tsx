import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, Heading, useModal } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { VaultUser } from 'views/Pools/types'
import { convertSharesToCake } from '../../../helpers'
import VaultStakeModal from '../VaultModals/VaultStakeModal'

interface HasStakeActionProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakingTokenPrice: number
  userInfo: VaultUser
  pricePerFullShare: BigNumber
  account: string
  performanceFee: number
  setLastUpdated: () => void
}

const HasSharesActions: React.FC<HasStakeActionProps> = ({
  pool,
  stakingTokenBalance,
  stakingTokenPrice,
  userInfo,
  pricePerFullShare,
  account,
  performanceFee,
  setLastUpdated,
}) => {
  const { stakingToken } = pool
  const { cakeAsBigNumber, cakeAsDisplayBalance } = convertSharesToCake(userInfo.shares, pricePerFullShare)

  const stakedDollarValue = formatNumber(
    getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals),
  )

  const [onPresentStake] = useModal(
    <VaultStakeModal
      account={account}
      stakingMax={stakingTokenBalance}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      setLastUpdated={setLastUpdated}
    />,
  )

  const [onPresentUnstake] = useModal(
    <VaultStakeModal
      account={account}
      stakingMax={cakeAsBigNumber}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      pricePerFullShare={pricePerFullShare}
      userInfo={userInfo}
      performanceFee={performanceFee}
      setLastUpdated={setLastUpdated}
      isRemovingStake
    />,
  )

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column">
        <Heading>{cakeAsDisplayBalance}</Heading>
        <Text fontSize="12px" color="textSubtle">{`~${stakedDollarValue || 0} USD`}</Text>
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

export default HasSharesActions
