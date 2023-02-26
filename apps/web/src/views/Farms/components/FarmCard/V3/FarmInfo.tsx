import { Flex, Farm as FarmUI, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { TokenPairImage } from 'components/TokenImage'
import FarmV3CardList from 'views/Farms/components/FarmCard/V3/FarmV3CardList'

const { AvailableFarming, TotalStakedBalance, ViewAllFarmModal } = FarmUI.FarmV3Card

interface FarmInfoProps {
  farm: FarmWithStakedValue
  isReady: boolean
  liquidityUrlPathParts: string
}

const FarmInfo: React.FunctionComponent<React.PropsWithChildren<FarmInfoProps>> = ({
  farm,
  isReady,
  liquidityUrlPathParts,
}) => {
  const { t } = useTranslation()
  const { lpSymbol, token, quoteToken, boosted, isStable, isCommunity, multiplier } = farm

  const [onClickViewAllButton] = useModal(
    <ViewAllFarmModal
      title={lpSymbol}
      isReady={isReady}
      lpSymbol={lpSymbol}
      isStable={isStable}
      boosted={boosted}
      isCommunityFarm={isCommunity}
      multiplier={multiplier}
      liquidityUrlPathParts={liquidityUrlPathParts}
      tokenPairImage={
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={32} height={32} />
      }
    >
      <Flex flexDirection="column">
        <FarmV3CardList title={t('%totalStakedFarm% Staked Farming', { totalStakedFarm: 2 })} farm={farm} />
        <FarmV3CardList
          title={t('%totalAvailableFarm% LP Available for Farming', { totalAvailableFarm: 2 })}
          farm={farm}
        />
      </Flex>
    </ViewAllFarmModal>,
  )

  return (
    <Flex flexDirection="column">
      <AvailableFarming lpSymbol={lpSymbol} onClickViewAllButton={onClickViewAllButton} />
      <TotalStakedBalance onClickViewAllButton={onClickViewAllButton} />
    </Flex>
  )
}

export default FarmInfo
