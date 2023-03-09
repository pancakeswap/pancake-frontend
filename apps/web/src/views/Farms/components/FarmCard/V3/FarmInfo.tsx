import { useMemo, useState } from 'react'
import { Flex, Farm as FarmUI, ModalV2 } from '@pancakeswap/uikit'
import { FarmV3DataWithPriceAndUserInfo } from '@pancakeswap/farms'
import { TokenPairImage } from 'components/TokenImage'
import FarmV3CardList from 'views/Farms/components/FarmCard/V3/FarmV3CardList'
import { BigNumber } from 'bignumber.js'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { usePriceCakeBusd } from 'state/farms/hooks'

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
  const cakePrice = usePriceCakeBusd()
  const [show, setShow] = useState(false)

  const { lpSymbol, token, quoteToken, multiplier, stakedPositions, unstakedPositions, pendingCakeByTokenIds } = farm

  const onlyOnePosition = useMemo(
    () => new BigNumber(stakedPositions.length).plus(unstakedPositions.length).eq(1),
    [stakedPositions, unstakedPositions],
  )

  const totalEarnings = useMemo(
    () =>
      Object.values(pendingCakeByTokenIds)
        .reduce((total, vault) => total.add(vault), EthersBigNumber.from('0'))
        .toNumber(),
    [pendingCakeByTokenIds],
  )

  const earningsBusd = useMemo(
    () => new BigNumber(totalEarnings).times(cakePrice).toNumber(),
    [cakePrice, totalEarnings],
  )

  return (
    <Flex flexDirection="column">
      {onlyOnePosition ? (
        <FarmV3CardList farm={farm} />
      ) : (
        <>
          {unstakedPositions.length > 0 && (
            <AvailableFarming
              lpSymbol={lpSymbol}
              unstakedPositions={unstakedPositions}
              onClickViewAllButton={() => setShow(true)}
            />
          )}
          {stakedPositions.length > 0 && (
            <TotalStakedBalance
              stakedPositions={stakedPositions}
              earnings={totalEarnings}
              earningsBusd={earningsBusd}
              onClickViewAllButton={() => setShow(true)}
            />
          )}
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
