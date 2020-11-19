import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, CardRibbon, useModal, Text } from '@pancakeswap-libs/uikit'
import { BSC_BLOCK_TIME } from 'config'
import { Ifo, IfoStatus } from 'sushi/lib/constants/types'
import useI18n from 'hooks/useI18n'
import useCurrentBlock from 'hooks/useCurrentBlock'
import { useIfoContract } from 'hooks/useContract'
import useTokenBalance from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import IfoCardHeader from './IfoCardHeader'
import IfoCardProgress from './IfoCardProgress'
import IfoCardDescription from './IfoCardDescription'
import IfoCardDetails from './IfoCardDetails'
import IfoCardTime from './IfoCardTime'
import LabelButton from './LabelButton'
import ContributeModal from './ContributeModal'

export interface IfoCardProps {
  ifo: Ifo
}

const StyledIfoCard = styled(Card)<{ ifoId: string }>`
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.svg')`};
  background-repeat: no-repeat;
  padding-top: 112px;
  margin-left: auto;
  margin-right: auto;
  max-width: 437px;
`

const getStatus = (currentBlock: number, startBlock: number, endBlock: number): IfoStatus | null => {
  if (currentBlock < startBlock) {
    return 'coming_soon'
  }

  if (currentBlock >= startBlock && currentBlock <= endBlock) {
    return 'live'
  }

  if (currentBlock > endBlock) {
    return 'finished'
  }

  return null
}

const getRibbonComponent = (status: IfoStatus, TranslateString: (translationId: number, fallback: string) => any) => {
  if (status === 'coming_soon') {
    return <CardRibbon variantColor="textDisabled" text={TranslateString(999, 'Coming Soon')} />
  }

  if (status === 'live') {
    return <CardRibbon variantColor="primary" text={TranslateString(999, 'LIVE NOW!')} />
  }

  return null
}

const IfoCard: React.FC<IfoCardProps> = ({ ifo }) => {
  const {
    id,
    address,
    name,
    subTitle,
    description,
    launchDate,
    launchTime,
    saleAmount,
    raiseAmount,
    cakeToBurn,
    projectSiteUrl,
    currency,
    currencyAddress,
  } = ifo
  const contract = useIfoContract(address)
  const currentBlock = useCurrentBlock()
  const [state, setState] = useState({
    isLoading: true,
    status: null,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 0,
    secondsUntilEnd: 0,
    campaignTarget: 0,
    totalRaised: 0,
  })
  const TranslateString = useI18n()
  const shitcoinBalance = getBalanceNumber(useTokenBalance(address))
  const [onPresentContributeModal] = useModal(
    <ContributeModal currency={currency} contract={contract} currencyAddress={currencyAddress} />,
  )

  const Ribbon = getRibbonComponent(state.status, TranslateString)

  useEffect(() => {
    const fetchProgress = async () => {
      const startBlock = await contract.methods.startBlock().call()
      const endBlock = await contract.methods.endBlock().call()
      const campaignTarget = parseInt(await contract.methods.raisingAmount().call(), 10)
      const totalRaised = parseInt(await contract.methods.totalAmount().call(), 10)
      const offeringAmount = parseInt(await contract.methods.offeringAmount().call(), 10)

      // TODO Remove after tests
      console.info(
        `=> Target (raisingAmount): ${campaignTarget} \n
TotalRaised (totalAmount): ${totalRaised} \n
OfferingAmount (offeringAmount): ${offeringAmount}`,
      )

      const startBlockNum = parseInt(startBlock, 10)
      const endBlockNum = parseInt(endBlock, 10)

      const status = getStatus(currentBlock, startBlockNum, endBlockNum)
      const totalBlocks = endBlockNum - startBlockNum
      const blocksRemaining = endBlockNum - currentBlock

      // Calculate the total progress with a default of 5%
      const progress = currentBlock > startBlockNum ? ((currentBlock - startBlockNum) / totalBlocks) * 100 : 5

      setState({
        isLoading: false,
        secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
        secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
        status,
        progress,
        blocksRemaining,
        campaignTarget,
        totalRaised,
      })
    }

    fetchProgress()
  }, [currentBlock, contract, setState])

  const isActive = state.status === 'live'

  return (
    <StyledIfoCard ifoId={id} ribbon={Ribbon} isActive={isActive}>
      <CardBody>
        <IfoCardHeader ifoId={id} name={name} subTitle={subTitle} />
        <IfoCardProgress progress={state.progress} />
        <IfoCardTime
          isLoading={state.isLoading}
          status={state.status}
          secondsUntilStart={state.secondsUntilStart}
          secondsUntilEnd={state.secondsUntilEnd}
        />
        {isActive && (
          <>
            <LabelButton
              buttonLabel="Contribute"
              label={`Your contribution (${currency})`}
              value={shitcoinBalance.toString()}
              onClick={onPresentContributeModal}
            />
            <Text fontSize="14px" color="textSubtle">
              {`Approx ?${state.totalRaised} | ${(state.totalRaised / state.campaignTarget) * 100}% of total`}
            </Text>
          </>
        )}
        <IfoCardDescription description={description} />
        <IfoCardDetails
          launchDate={launchDate}
          launchTime={launchTime}
          saleAmount={saleAmount}
          raiseAmount={raiseAmount}
          cakeToBurn={cakeToBurn}
          projectSiteUrl={projectSiteUrl}
        />
      </CardBody>
    </StyledIfoCard>
  )
}

export default IfoCard
