import React, { useState, useEffect } from 'react'
import { Flex, Text, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import PredictionItem from './PredictionItem'

const Container = styled.div`
  margin-top: 24px;
  padding-bottom: 16px;
  border-radius: 16px;
  border: 2px solid ${(props) => props.theme.colors.input};
`
const ScrollContainer = styled(Flex)`
  width: 1124px;
  padding: 16px 0 24px 0;
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`
const PredictionList: React.FC = () => {
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    setPredictions([
      { status: 'EXPIRED' },
      { status: 'LIVE' },
      { status: 'COMING' },
      { status: 'COMING' },
      { status: 'COMING' },
      { status: 'COMING' },
    ])
  }, [setPredictions])

  return (
    <Container>
      <ScrollContainer>
        {predictions.map((item) => (
          <PredictionItem {...item} />
        ))}
      </ScrollContainer>
      <Flex px="20px" justifyContent="space-between">
        <Text bold color="primary">
          <ArrowForwardIcon
            width="24px"
            mr="1"
            color="primary"
            style={{ transform: 'rotate(180deg)', verticalAlign: '-7px' }}
          />
          Back
        </Text>
        <Text bold color="primary">
          More
          <ArrowForwardIcon width="24px" ml="1" color="primary" style={{ verticalAlign: '-7px' }} />
        </Text>
      </Flex>
    </Container>
  )
}

export default PredictionList
