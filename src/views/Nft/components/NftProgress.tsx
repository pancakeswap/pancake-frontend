import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, OpenNewIcon, Text, Link as UIKitLink } from '@pancakeswap-libs/uikit'
import { BSC_BLOCK_TIME } from 'config'
import { RABBIT_MINTING_FARM_ADDRESS } from 'sushi/lib/constants/nfts'
import { useRabbitMintingFarm } from 'hooks/rework/useContract'
import useI18n from 'hooks/useI18n'
import useCurrentBlock from 'hooks/rework/useCurrentBlock'
import getTimePeriods from 'utils/getTimePeriods'
import formatTimePeriod from 'utils/formatTimePeriod'

const TimeLeft = styled(Heading)`
  margin-bottom: 16px;
  text-align: center;
`

const Row = styled.div`
  align-items: center;
  display: flex;

  & > div:first-child {
    flex: 1;
  }

  & > div:last-child {
    text-align: right;
  }
`

const Link = styled(UIKitLink)`
  text-decoration: underline;
`

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  padding-top: 16px;
  text-align: center;
`

const NftProgress = () => {
  const [state, setState] = useState({
    isLoading: true,
    currentDistributedSupply: 0,
    totalSupplyDistributed: 0,
    endBlockNumber: 0,
  })
  const TranslateString = useI18n()
  const currentBlock = useCurrentBlock()
  const rabbitMintingFarmContract = useRabbitMintingFarm(RABBIT_MINTING_FARM_ADDRESS)

  useEffect(() => {
    const fetchMintData = async () => {
      try {
        const { methods } = rabbitMintingFarmContract
        const totalSupplyDistributed = await methods.totalSupplyDistributed().call()
        const currentDistributedSupply = await methods.currentDistributedSupply().call()
        const endBlockNumber = await methods.endBlockNumber().call()

        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          currentDistributedSupply,
          totalSupplyDistributed,
          endBlockNumber,
        }))
      } catch (e) {
        console.error(e)
      }
    }

    fetchMintData()
  }, [rabbitMintingFarmContract, setState])

  // TODO - use "state.endBlockNumer"
  const secondsRemaining = (4538721 - currentBlock) * BSC_BLOCK_TIME
  const timeLeft = formatTimePeriod(getTimePeriods(secondsRemaining), ['seconds'])

  return (
    <Card>
      <CardBody>
        <TimeLeft>
          {timeLeft ? TranslateString(999, `${timeLeft} left to trade in NFTs`) : TranslateString(999, 'Finished!')}
        </TimeLeft>
        <Row>
          <Text>{TranslateString(999, "Total NFT's claimed")}:</Text>
          <Text>
            <strong>
              {state.isLoading ? '...' : `${state.currentDistributedSupply}/${state.totalSupplyDistributed}`}
            </strong>
          </Text>
        </Row>
        <Row>
          <Text>{TranslateString(999, 'Can be traded until')}:</Text>
          <div>
            {state.isLoading ? (
              '...'
            ) : (
              <Link
                href={`https://bscscan.com/block/${state.endBlockNumber}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {`Block ${state.endBlockNumber}`}
                <OpenNewIcon color="primary" ml="2px" />
              </Link>
            )}{' '}
          </div>
        </Row>
        <Message>{TranslateString(999, 'NFTs can be traded in for CAKE until the above block height')}</Message>
      </CardBody>
    </Card>
  )
}

export default NftProgress
