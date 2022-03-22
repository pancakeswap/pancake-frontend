import { Flex, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { LightGreyCard } from 'components/Card'
import { DeserializedPool } from 'state/types'
import Apr from '../../Apr'

interface AprRowProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  performanceFee?: number
}

export const StakingApr = ({ pool, stakedBalance, performanceFee = 0 }: AprRowProps) => {
  return (
    <LightGreyCard>
      <Flex>
        <Text color="secondary" textTransform="uppercase" bold fontSize="12px">
          Flexible staking APR:
        </Text>
        <Apr pool={pool} stakedBalance={stakedBalance} performanceFee={performanceFee} showIcon />
      </Flex>
      <Flex>
        <Text color="secondary" textTransform="uppercase" bold fontSize="12px">
          Locked staking APR:
        </Text>
        <Apr pool={pool} stakedBalance={stakedBalance} performanceFee={performanceFee} showIcon />
      </Flex>
    </LightGreyCard>
  )
}
