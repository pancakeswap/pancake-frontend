import styled from 'styled-components'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { PositionDetails } from '@pancakeswap/farms'
import { Flex, Box, Farm as FarmUI } from '@pancakeswap/uikit'
import { ActionContent, ActionTitles } from 'views/Farms/components/FarmTable/V3/Actions/styles'

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
}

const SingleFarmV3Card: React.FunctionComponent<React.PropsWithChildren<SingleFarmV3CardProps>> = ({
  lpSymbol,
  position,
  positionType,
}) => {
  return (
    <Box width="100%">
      <ActionContainer>
        <ActionContent width="100%" flexDirection="column">
          <FarmV3StakeAndUnStake
            title={`${lpSymbol}
            (#${position.tokenId.toString()})`}
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
              proxyCakeBalance={0}
              handleHarvest={() => 123}
            />
          </ActionContent>
        )}
      </ActionContainer>
    </Box>
  )
}

export default SingleFarmV3Card
