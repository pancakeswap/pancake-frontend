import { Balance, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked?: BigNumber
}

const TotalStakedCell: React.FC<React.PropsWithChildren<TotalStakedCellProps>> = ({
  stakingToken,
  totalStaked,
  totalStakedBalance,
}) => {
  const { t } = useTranslation()

  return (
    <Pool.BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total staked')}
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Pool.CellContent>
    </Pool.BaseCell>
  )
}

export default TotalStakedCell
