import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import SingleFarmV3Card from 'views/Farms/components/FarmCard/V3/SingleFarmV3Card'

interface FarmV3CardListProps {
  farm: FarmV3DataWithPriceAndUserInfo
}

const FarmV3CardList: React.FunctionComponent<React.PropsWithChildren<FarmV3CardListProps>> = ({ farm }) => {
  const { t } = useTranslation()
  const { stakedPositions, unstakedPositions, lpSymbol } = farm

  return (
    <Box>
      {stakedPositions && (
        <Flex flexDirection="column" width="100%" mb="24px">
          <Text bold fontSize="12px" color="textSubtle" m="0 0 8px 0">
            {t('%totalStakedFarm% Staked Farming', { totalStakedFarm: stakedPositions.length })}
          </Text>
          <Flex flexWrap="wrap" width="100%">
            {stakedPositions.map((position) => (
              <SingleFarmV3Card
                key={position.tokenId.toString()}
                lpSymbol={lpSymbol}
                position={position}
                positionType="staked"
              />
            ))}
          </Flex>
        </Flex>
      )}
      {unstakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px">
          <Text bold fontSize="12px" color="textSubtle" m="0 0 8px 0">
            {t('%totalAvailableFarm% LP Available for Farming', { totalStakedFarm: unstakedPositions.length })}
          </Text>
          <Flex flexWrap="wrap" width="100%">
            {unstakedPositions.map((position) => (
              <SingleFarmV3Card
                key={position.tokenId.toString()}
                lpSymbol={lpSymbol}
                position={position}
                positionType="unstaked"
              />
            ))}
          </Flex>
        </Flex>
      )}
    </Box>
  )
}

export default FarmV3CardList
