import React, { useCallback, useContext, useMemo } from 'react'
import { Flex, Text, Button } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { usePredictionBnb } from 'hooks/useContract'
import CountDown from './CountDown'
import { PredictionProviderContext } from '../contexts/PredictionProvider'

const StyledButton = styled(Button)`
  color: ${(props) => props.theme.colors.card};
`
const SwitchBox = styled.div`
  display: flex;
  align-items: center;
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.input};
`

const Heading: React.FC = () => {
  const { currentEpoch, remainSecond, updateEpoch } = useContext(PredictionProviderContext)
  const bnbPredictionContract = usePredictionBnb()
  const onTimeOver = useCallback(async () => {
    // start next round
    const cEpoch = await bnbPredictionContract.methods.currentEpoch().call()
    if (currentEpoch !== -1 && currentEpoch !== +cEpoch) {
      updateEpoch(+cEpoch)
    }
  }, [currentEpoch, updateEpoch, bnbPredictionContract])

  return useMemo(
    () => (
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <img src="images/tokens/BNB.png" alt="BNB" width={32} height={32} />
          <Text ml="2" mr="2" style={{ lineHeight: '26px' }} fontSize="24px" bold>
            BNB/USDT
          </Text>
          <Text ml="3" color="textSubtle">
            Pay with:{' '}
            <StyledButton size="sm" ml="2">
              BNB
            </StyledButton>
          </Text>
        </Flex>
        <SwitchBox>
          <StyledButton size="sm" mr="2">
            10m
          </StyledButton>
          <CountDown
            key={`${currentEpoch}-${remainSecond}`}
            seconds={remainSecond}
            timeOver={onTimeOver}
            style={{ width: '70px' }}
          />
        </SwitchBox>
      </Flex>
    ),
    [currentEpoch, remainSecond, onTimeOver],
  )
}

export default React.memo(Heading)
