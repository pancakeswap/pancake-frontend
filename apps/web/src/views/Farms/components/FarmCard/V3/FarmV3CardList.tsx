import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import SingleFarmV3Card from 'views/Farms/components/FarmCard/V3/SingleFarmV3Card'

interface FarmV3CardListProps {
  farm: FarmV3DataWithPriceAndUserInfo
  onDismiss?: () => void
}

const FarmV3CardList: React.FunctionComponent<React.PropsWithChildren<FarmV3CardListProps>> = ({ farm, onDismiss }) => {
  const { t } = useTranslation()
  const { stakedPositions, unstakedPositions, lpSymbol, token, quoteToken, pendingCakeByTokenIds } = farm

  return (
    <Box>
      {stakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px">
          <Text bold fontSize="12px" color="textSubtle" m="0 0 8px 0">
            {t('%totalStakedFarm% Staked Farming', { totalStakedFarm: stakedPositions.length })}
          </Text>
          <Flex flexWrap="wrap" width="100%">
            {stakedPositions.map((position) => (
              <SingleFarmV3Card
                positionType="staked"
                key={position.tokenId.toString()}
                lpSymbol={lpSymbol}
                position={position}
                token={token}
                quoteToken={quoteToken}
                pendingCakeByTokenIds={pendingCakeByTokenIds}
                onDismiss={onDismiss}
              />
            ))}
          </Flex>
        </Flex>
      )}
      {unstakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px">
          <Text bold fontSize="12px" color="textSubtle" m="0 0 8px 0">
            {t('%totalAvailableFarm% LP Available for Farming', { totalAvailableFarm: unstakedPositions.length })}
          </Text>
          <Flex flexWrap="wrap" width="100%">
            {unstakedPositions.map((position) => (
              <SingleFarmV3Card
                positionType="unstaked"
                key={position.tokenId.toString()}
                lpSymbol={lpSymbol}
                position={position}
                token={token}
                quoteToken={quoteToken}
                pendingCakeByTokenIds={pendingCakeByTokenIds}
                onDismiss={onDismiss}
              />
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  )
}

export default FarmV3CardList
