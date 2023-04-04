import { useTranslation } from '@pancakeswap/localization'
import partition_ from 'lodash/partition'
import { AutoRow, Box, Flex, PreTitle } from '@pancakeswap/uikit'
import { isPositionOutOfRange } from '@pancakeswap/utils/isPositionOutOfRange'
import { usePool } from 'hooks/v3/usePools'
import SingleFarmV3Card from 'views/Farms/components/FarmCard/V3/SingleFarmV3Card'
import { V3Farm } from 'views/Farms/FarmsV3'

interface FarmV3CardListProps {
  farm: V3Farm
  harvesting?: boolean
  direction?: 'row' | 'column'
  onDismiss?: () => void
}

const FarmV3CardList: React.FunctionComponent<React.PropsWithChildren<FarmV3CardListProps>> = ({
  farm,
  onDismiss,
  direction,
  harvesting,
}) => {
  const { t } = useTranslation()
  const { stakedPositions, unstakedPositions, lpSymbol, token, quoteToken, pendingCakeByTokenIds, multiplier } = farm
  const [, pool] = usePool(farm.token, farm.quoteToken, farm.feeAmount)

  return (
    <Box width="100%">
      {stakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px" id={`${farm.pid}-farm-v3-staking`}>
          <PreTitle color="textSubtle" m="0 0 8px 0">
            {t('%totalStakedFarm% Staked Farming', { totalStakedFarm: stakedPositions.length })}
          </PreTitle>
          <Flex flexWrap="wrap" width="100%">
            {stakedPositions.map((position) => (
              <SingleFarmV3Card
                harvesting={harvesting}
                pool={pool}
                width="100%"
                direction={direction}
                positionType="staked"
                farm={farm}
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
      {multiplier !== '0X' && unstakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px" id={`${farm.pid}-farm-v3-available`}>
          <PreTitle fontSize="12px" color="textSubtle" m="0 0 8px 0">
            {t('%totalAvailableFarm% LP Available for Farming', { totalAvailableFarm: unstakedPositions.length })}
          </PreTitle>
          <AutoRow width="100%" gap="16px" alignItems="stretch">
            {partition_(unstakedPositions, (position) => !isPositionOutOfRange(pool?.tickCurrent, position))
              .flat()
              .map((position) => (
                <SingleFarmV3Card
                  farm={farm}
                  style={{
                    minWidth: '49%',
                  }}
                  pool={pool}
                  flex={1}
                  direction={direction}
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
          </AutoRow>
        </Flex>
      )}
    </Box>
  )
}

export default FarmV3CardList
