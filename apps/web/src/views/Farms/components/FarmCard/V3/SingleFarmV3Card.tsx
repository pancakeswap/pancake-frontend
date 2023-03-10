import styled from 'styled-components'
import { useMemo } from 'react'
import { PositionDetails, IPendingCakeByTokenId } from '@pancakeswap/farms'
import { Flex, Box, Farm as FarmUI } from '@pancakeswap/uikit'
import { ActionContent, ActionTitles } from 'views/Farms/components/FarmTable/V3/Actions/styles'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Token } from '@pancakeswap/swap-sdk-core'
import { useAccount, useSigner } from 'wagmi'
import useFarmV3Actions from 'views/Farms/hooks/v3/useFarmV3Actions'
import JSBI from 'jsbi'
import { BigNumber } from 'bignumber.js'
import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { V3Farm } from 'views/Farms/FarmsV3'
import FarmV3StakeAndUnStake from './FarmV3StakeAndUnStake'

const { FarmV3HarvestAction } = FarmUI.FarmV3Table

const ActionContainer = styled(Flex)`
  width: 100%;
  padding: 0 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  // background-color: ${({ theme }) => theme.colors.dropdown};
  flex-direction: column;

  > ${ActionTitles}, > ${ActionContent} {
    padding: 16px 0;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }

  ${ActionContent} {
    border-bottom: 2px solid ${({ theme }) => theme.colors.input};

    &:last-child {
      border: 0;
    }
  }
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
}

const SingleFarmV3Card: React.FunctionComponent<React.PropsWithChildren<SingleFarmV3CardProps>> = ({
  farm,
  lpSymbol,
  position,
  token,
  quoteToken,
  positionType,
  pendingCakeByTokenIds,
  onDismiss,
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

  const totalEarnings = useMemo(() => {
    return Object.values(pendingCakeByTokenIds)
      .reduce((total, vault) => total.add(vault), EthersBigNumber.from('0'))
      .toNumber()
  }, [pendingCakeByTokenIds])

  const earningsBusd = useMemo(() => {
    return new BigNumber(totalEarnings).times(cakePrice).toNumber()
  }, [cakePrice, totalEarnings])

  return (
    <Box width="100%">
      <ActionContainer bg="background">
        <ActionContent width="100%" flexDirection="column">
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
        </ActionContent>
        {positionType !== 'unstaked' && (
          <ActionContent width="100%" flexDirection="column">
            <FarmV3HarvestAction
              earnings={totalEarnings}
              earningsBusd={earningsBusd}
              pendingTx={false}
              userDataReady={false}
              handleHarvest={handleHarvest}
            />
          </ActionContent>
        )}
      </ActionContainer>
    </Box>
  )
}

export default SingleFarmV3Card
