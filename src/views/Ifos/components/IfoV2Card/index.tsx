import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, CardRibbon, ExpandableButton, Progress } from '@pancakeswap-libs/uikit'
import { Ifo, IfoStatus } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import useGetPublicIfoData from 'hooks/ifo/v1/useGetPublicIfoData'
import useGetWalletIfoData from 'hooks/ifo/v1/useGetWalletIfoData'
import IfoCard from './SmallCard'
import Timer from './Timer'

interface IfoFoldableCardProps {
  ifo: Ifo
  isInitiallyVisible: boolean
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

const Header = styled(CardHeader)<{ ifoId: string }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 112px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.svg')`};
`

const FoldableContent = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`

const CardWrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
`

const IfoFoldableCard: React.FC<IfoFoldableCardProps> = ({ ifo, isInitiallyVisible }) => {
  const [isVisible, setIsVisible] = useState(isInitiallyVisible)
  const TranslateString = useI18n()
  const publicIfoData = useGetPublicIfoData(ifo)
  const walletIfoData = useGetWalletIfoData(ifo)

  const Ribbon = getRibbonComponent(publicIfoData.status, TranslateString)
  const isInProgress = publicIfoData.status !== 'finished' && ifo.isActive

  return (
    <Card ribbon={Ribbon}>
      <Header ifoId={ifo.id}>
        <ExpandableButton expanded={isVisible} onClick={() => setIsVisible((prev) => !prev)} />
      </Header>
      <FoldableContent isVisible={isVisible}>
        {isInProgress && <Progress variant="flat" primaryStep={publicIfoData.progress} />}
        <CardBody>
          {isInProgress && <Timer publicIfoData={publicIfoData} />}
          <CardWrapper>
            <IfoCard cardType="basic" ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
            <IfoCard cardType="unlimited" ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
          </CardWrapper>
        </CardBody>
      </FoldableContent>
    </Card>
  )
}

export default IfoFoldableCard
