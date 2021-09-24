import React from 'react'
import { Flex, BinanceIcon, Text } from '@pancakeswap/uikit'
import { multiplyPriceByAmount } from 'utils/prices'
import { useTranslation } from 'contexts/Localization'

const ActivityPrice = ({ bnbBusdPrice, price }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, price)

  return (
    <Flex flexDirection="column" alignItems="flex-end">
      {price ? (
        <>
          <Flex justifySelf="flex-start" alignItems="center">
            <BinanceIcon width="12px" height="12px" mr="4px" />
            <Text bold>{price}</Text>
          </Flex>
          <Text fontSize="12px" color="textSubtle">
            {`(~$${priceInUsd.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </Text>
        </>
      ) : (
        '-'
      )}
    </Flex>
  )
}

export default ActivityPrice
