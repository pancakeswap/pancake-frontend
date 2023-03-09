import { useMemo, useState } from 'react'
import { Flex, Farm as FarmUI, ModalV2 } from '@pancakeswap/uikit'
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
  const [show, setShow] = useState(false)
  const { lpSymbol, token, quoteToken, multiplier, stakedPositions, unstakedPositions } = farm

  const onlyOnePosition = useMemo(
    () => stakedPositions.length === 1 || unstakedPositions.length === 1,
    [stakedPositions, unstakedPositions],
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
            onClickViewAllButton={() => setShow(true)}
          />
          <TotalStakedBalance stakedPositions={stakedPositions} onClickViewAllButton={() => setShow(true)} />
        </>
      )}
      <ModalV2 isOpen={show} onDismiss={() => setShow(false)} closeOnOverlayClick>
        <ViewAllFarmModal
          title={lpSymbol}
          isReady={isReady}
          lpSymbol={lpSymbol}
          multiplier={multiplier}
          liquidityUrlPathParts={liquidityUrlPathParts}
          tokenPairImage={
            <TokenPairImage
              variant="inverted"
              primaryToken={token}
              secondaryToken={quoteToken}
              width={32}
              height={32}
            />
          }
          onDismiss={() => setShow(false)}
        >
          <Flex flexDirection="column">
            <FarmV3CardList farm={farm} onDismiss={() => setShow(false)} />
          </Flex>
        </ViewAllFarmModal>
        ,
      </ModalV2>
    </Flex>
  )
}

export default FarmInfo
