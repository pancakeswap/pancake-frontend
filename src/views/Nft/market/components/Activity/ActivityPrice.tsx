import { Flex, BinanceIcon, Text, Skeleton } from '@pancakeswap/uikit'
import { multiplyPriceByAmount } from 'utils/prices'
import { useTranslation } from 'contexts/Localization'

const ActivityPrice = ({ bnbBusdPrice, price }) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, price)

  return (
    <Flex flexDirection="column" alignItems="flex-end">
      {price ? (
        <>
          <Flex justifySelf="flex-start" alignItems="center">
            <BinanceIcon width="12px" height="12px" mr="4px" />
            <Text maxWidth="80px" bold>
              {price.toLocaleString(locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 5,
              })}
            </Text>
          </Flex>
          {priceInUsd ? (
            <Text fontSize="12px" color="textSubtle">
              {`(~$${priceInUsd.toLocaleString(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })})`}
            </Text>
          ) : (
            <Skeleton height="18px" width="42px" />
          )}
        </>
      ) : (
        '-'
      )}
    </Flex>
  )
}

export default ActivityPrice
