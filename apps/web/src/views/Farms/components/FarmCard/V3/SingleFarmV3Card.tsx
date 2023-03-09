import styled from 'styled-components'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { PositionDetails } from '@pancakeswap/farms'
import { Flex, Box, Farm as FarmUI } from '@pancakeswap/uikit'
import { ActionContent, ActionTitles } from 'views/Farms/components/FarmTable/V3/Actions/styles'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Token } from '@pancakeswap/swap-sdk-core'

const { FarmV3HarvestAction, FarmV3StakeAndUnStake } = FarmUI.FarmV3Table

const ActionContainer = styled(Flex)`
  width: 100%;
  padding: 0 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.dropdown};
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

type PositionType = 'staked' | 'unstaked'

interface SingleFarmV3CardProps {
  lpSymbol: string
  position: PositionDetails
  positionType: PositionType
  token: Token
  quoteToken: Token
  onDismiss?: () => void
}

const SingleFarmV3Card: React.FunctionComponent<React.PropsWithChildren<SingleFarmV3CardProps>> = ({
  lpSymbol,
  position,
  token,
  quoteToken,
  positionType,
  onDismiss,
}) => {
  const { chainId } = useActiveChainId()
  const title = `${lpSymbol} (#${position.tokenId.toString()})`
  const liquidityUrl = `/liquidity/${position.tokenId.toString()}?chain=${CHAIN_QUERY_NAME[chainId]}`

  const handleStake = () => {
    onDismiss?.()
  }

  const handleUnStake = () => {
    onDismiss?.()
  }

  const handleHarvest = () => {
    onDismiss?.()
  }

  return (
    <Box width="100%">
      <ActionContainer>
        <ActionContent width="100%" flexDirection="column">
          <FarmV3StakeAndUnStake
            title={title}
            position={position}
            token={token}
            quoteToken={quoteToken}
            positionType={positionType}
            liquidityUrl={liquidityUrl}
            handleStake={handleStake}
            handleUnStake={handleUnStake}
          />
        </ActionContent>
        {positionType !== 'unstaked' && (
          <ActionContent width="100%" flexDirection="column">
            <FarmV3HarvestAction
              earnings={BIG_ZERO}
              earningsBusd={323}
              displayBalance="123"
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
