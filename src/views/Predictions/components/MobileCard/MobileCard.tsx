import React from 'react'
import { BoxProps, Flex, Text } from '@rug-zombie-libs/uikit'
import { BigNumber } from 'bignumber.js'
import PositionTag from '../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from './styles'
import { zmbeBnbLpPriceBnb } from '../../../../redux/get'
import { getBalanceAmount } from '../../../../utils/formatBalance'

const MobileCard = ( ) => {
  return (
    <>
      <br/>
    <RoundResultBox >
      <Text color="secondary" fontSize="20px" bold textTransform="uppercase" mb="8px">
        View on desktop
      </Text>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">

          <Text color="primary">The Mausoleum is coming soon to mobile.</Text>
        </Flex>

    </RoundResultBox>
    </>
  )
}

export default MobileCard
