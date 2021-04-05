import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, CardRibbon, ExpandableButton, Progress } from '@pancakeswap-libs/uikit'
import { Ifo, IfoStatus } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import useGetPublicIfoData from 'hooks/useGetPublicIfoData'
import IfoCard from './IfoCard'

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
  const publicIfoData = useGetPublicIfoData(ifo)
  const TranslateString = useI18n()
  const Ribbon = getRibbonComponent(publicIfoData.status, TranslateString)

  return (
    <Card ribbon={Ribbon}>
      <Header ifoId={ifo.id}>
        <ExpandableButton expanded={isVisible} onClick={() => setIsVisible((prev) => !prev)} />
      </Header>
      <FoldableContent isVisible={isVisible}>
        {publicIfoData.status !== 'finished' && ifo.isActive && (
          <Progress variant="flat" primaryStep={publicIfoData.progress} />
        )}
        <CardBody>
          <CardWrapper>
            <IfoCard ifo={ifo} />
            <IfoCard ifo={ifo} />
          </CardWrapper>
        </CardBody>
      </FoldableContent>
    </Card>
  )
}

export default IfoFoldableCard
