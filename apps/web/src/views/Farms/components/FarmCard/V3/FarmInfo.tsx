import { useMemo } from 'react'
import { Flex, Farm as FarmUI, useModal } from '@pancakeswap/uikit'
import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import { TokenPairImage } from 'components/TokenImage'
import FarmV3CardList from 'views/Farms/components/FarmCard/V3/FarmV3CardList'

const { AvailableFarming, TotalStakedBalance, ViewAllFarmModal } = FarmUI.FarmV3Card

interface FarmInfoProps {
  farm: FarmV3DataWithPriceAndUserInfo
  isReady: boolean
  liquidityUrlPathParts: string
}

const FarmInfo: React.FunctionComponent<React.PropsWithChildren<FarmInfoProps>> = ({
  farm,
  isReady,
  liquidityUrlPathParts,
}) => {
  const { lpSymbol, token, quoteToken, multiplier, stakedPositions, unstakedPositions } = farm

  const onlyOnePosition = useMemo(
    () => stakedPositions.length === 1 || unstakedPositions.length === 1,
    [stakedPositions, unstakedPositions],
  )

  const [onClickViewAllButton] = useModal(
    <ViewAllFarmModal
      title={lpSymbol}
      isReady={isReady}
      lpSymbol={lpSymbol}
      multiplier={multiplier}
      liquidityUrlPathParts={liquidityUrlPathParts}
      tokenPairImage={
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={32} height={32} />
      }
    >
      <Flex flexDirection="column">
        <FarmV3CardList farm={farm} />
      </Flex>
    </ViewAllFarmModal>,
  )

  return (
    <Flex flexDirection="column">
      {onlyOnePosition ? (
        <FarmV3CardList farm={farm} />
      ) : (
        <>
          <AvailableFarming
            lpSymbol={lpSymbol}
            unstakedPositions={unstakedPositions}
            onClickViewAllButton={onClickViewAllButton}
          />
          <TotalStakedBalance stakedPositions={stakedPositions} onClickViewAllButton={onClickViewAllButton} />
        </>
      )}
    </Flex>
  )
}

export default FarmInfo
