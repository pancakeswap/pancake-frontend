import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { IPendingCakeByTokenId, PositionDetails } from '@pancakeswap/farms'
import { Token } from '@pancakeswap/swap-sdk-core'
import { AtomBox, AtomBoxProps } from '@pancakeswap/ui'
import { Farm as FarmUI, Flex, RowBetween } from '@pancakeswap/uikit'
import { formatBigNumber } from '@pancakeswap/utils/formatBalance'
import { BigNumber } from 'bignumber.js'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { usePriceCakeBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { V3Farm } from 'views/Farms/FarmsV3'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import { useAccount, useSigner } from 'wagmi'
import FarmV3StakeAndUnStake from './FarmV3StakeAndUnStake'

const { FarmV3HarvestAction } = FarmUI.FarmV3Table

const ActionContainer = styled(Flex)<{ $direction: 'row' | 'column' }>`
  width: 100%;
  padding: 0 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  flex-direction: ${({ $direction }) => $direction};
  flex-wrap: wrap;
  padding: 16px;
  gap: 24px;
`

ActionContainer.defaultProps = {
  bg: 'dropdown',
}

type PositionType = 'staked' | 'unstaked'

interface SingleFarmV3CardProps {
  farm: V3Farm
  lpSymbol: string
  position: PositionDetails
  positionType: PositionType
  token: Token
  quoteToken: Token
  pendingCakeByTokenIds: IPendingCakeByTokenId
  onDismiss?: () => void
  direction?: 'row' | 'column'
}

const SingleFarmV3Card: React.FunctionComponent<
  React.PropsWithChildren<SingleFarmV3CardProps & Omit<AtomBoxProps, 'position'>>
> = ({
  farm,
  lpSymbol,
  position,
  token,
  quoteToken,
  positionType,
  pendingCakeByTokenIds,
  onDismiss,
  direction = 'column',
  ...atomBoxProps
}) => {
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const { data: signer } = useSigner()
  const cakePrice = usePriceCakeBusd()
  const { tokenId } = position

  const title = `${lpSymbol} (#${tokenId.toString()})`
  const liquidityUrl = `/liquidity/${tokenId.toString()}?chain=${CHAIN_QUERY_NAME[chainId]}`

  const { onStake, onUnstake, onHarvest, attemptingTxn } = useFarmV3Actions({
    tokenId: JSBI.BigInt(tokenId),
    account,
    signer,
  })

  const handleStake = async () => {
    await onStake()
    if (!attemptingTxn) {
      onDismiss?.()
    }
  }

  const handleUnStake = async () => {
    await onUnstake()
    if (!attemptingTxn) {
      onDismiss?.()
    }
  }

  const handleHarvest = async () => {
    await onHarvest()
    if (!attemptingTxn) {
      onDismiss?.()
    }
  }

  const totalEarnings = useMemo(
    () =>
      +formatBigNumber(
        Object.values(pendingCakeByTokenIds).reduce((total, vault) => total.add(vault), EthersBigNumber.from('0')),
        4,
      ),
    [pendingCakeByTokenIds],
  )

  const earningsBusd = useMemo(() => {
    return new BigNumber(totalEarnings).times(cakePrice).toNumber()
  }, [cakePrice, totalEarnings])

  return (
    <AtomBox {...atomBoxProps}>
      <ActionContainer bg="background" $direction={direction}>
        <RowBetween flexDirection="column" alignItems="flex-start" flex={1}>
          <FarmV3StakeAndUnStake
            title={title}
            farm={farm}
            position={position}
            token={token}
            quoteToken={quoteToken}
            positionType={positionType}
            liquidityUrl={liquidityUrl}
            isPending={attemptingTxn}
            handleStake={handleStake}
            handleUnStake={handleUnStake}
          />
        </RowBetween>
        {positionType !== 'unstaked' && (
          <>
            <AtomBox border="1" />
            <RowBetween flexDirection="column" alignItems="flex-start" flex={1} width="full">
              <FarmV3HarvestAction
                earnings={totalEarnings}
                earningsBusd={earningsBusd}
                pendingTx={false}
                userDataReady={false}
                handleHarvest={handleHarvest}
              />
            </RowBetween>
          </>
        )}
      </ActionContainer>
    </AtomBox>
  )
}

export default SingleFarmV3Card
