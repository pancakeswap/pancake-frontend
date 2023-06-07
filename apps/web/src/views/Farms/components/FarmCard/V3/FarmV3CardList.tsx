import { useTranslation } from '@pancakeswap/localization'
import partition_ from 'lodash/partition'
import { AutoRenewIcon, AutoRow, Box, Button, Flex, PreTitle, Text } from '@pancakeswap/uikit'
import { isPositionOutOfRange } from '@pancakeswap/utils/isPositionOutOfRange'
import { usePool } from 'hooks/v3/usePools'
import SingleFarmV3Card from 'views/Farms/components/FarmCard/V3/SingleFarmV3Card'
import { V3Farm } from 'views/Farms/FarmsV3'
import { useCallback } from 'react'
import { useFarmsV3BatchHarvest } from 'views/Farms/hooks/v3/useFarmV3Actions'

interface FarmV3CardListProps {
  farm: V3Farm
  harvesting?: boolean
  direction?: 'row' | 'column'
  onDismiss?: () => void
  showHarvestAll?: boolean
}

const FarmV3CardList: React.FunctionComponent<React.PropsWithChildren<FarmV3CardListProps>> = ({
  farm,
  onDismiss,
  direction,
  harvesting,
  showHarvestAll,
}) => {
  const { t } = useTranslation()
  const { onHarvestAll, harvesting: v3BatchHarvesting } = useFarmsV3BatchHarvest()
  const { stakedPositions, unstakedPositions, lpSymbol, token, quoteToken, pendingCakeByTokenIds, multiplier } = farm
  const [, pool] = usePool(farm.token, farm.quoteToken, farm.feeAmount)

  const harvestAllFarms = useCallback(async () => {
    onHarvestAll(stakedPositions.map((value) => value.tokenId.toString()))
  }, [onHarvestAll, stakedPositions])

  return (
    <Box width="100%">
      {multiplier !== '0X' && unstakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px" id={`${farm.pid}-farm-v3-available`}>
          <PreTitle fontSize="12px" color="textSubtle" m="0 0 8px 0">
            {t('%totalAvailableFarm% LP Available for Farming', { totalAvailableFarm: unstakedPositions.length })}
          </PreTitle>
          <AutoRow width="100%" gap="16px" flexDirection="column" alignItems="flex-start">
            {partition_(unstakedPositions, (position) => !isPositionOutOfRange(pool?.tickCurrent, position))
              .flat()
              .map((position) => (
                <>
                  <SingleFarmV3Card
                    farm={farm}
                    style={{
                      minWidth: '49%',
                      width: '100%',
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
                </>
              ))}
          </AutoRow>
        </Flex>
      )}
      {stakedPositions.length > 0 && (
        <Flex flexDirection="column" width="100%" mb="24px" id={`${farm.pid}-farm-v3-staking`}>
          <PreTitle color="textSubtle" m="0 0 8px 0">
            {t('%totalStakedFarm% Staked Farming', { totalStakedFarm: stakedPositions.length })}
          </PreTitle>
          <Flex flexWrap="wrap" width="100%">
            {stakedPositions.map((position) => (
              <>
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
              </>
            ))}
            {showHarvestAll && stakedPositions.length > 1 && (
              <Button
                width="100%"
                id="harvest-all"
                isLoading={v3BatchHarvesting}
                endIcon={v3BatchHarvesting ? <AutoRenewIcon spin color="currentColor" /> : null}
                disabled={v3BatchHarvesting}
                onClick={harvestAllFarms}
              >
                <Text color="invertedContrast" bold>
                  {v3BatchHarvesting ? t('Harvesting') : t('Harvest all')}
                </Text>
              </Button>
            )}
          </Flex>
        </Flex>
      )}
    </Box>
  )
}

export default FarmV3CardList
