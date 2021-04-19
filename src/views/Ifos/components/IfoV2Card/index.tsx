import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardRibbon,
  ExpandableButton,
  Progress,
  Button,
  ChevronUpIcon,
} from '@pancakeswap-libs/uikit'
import { Ifo, IfoStatus, PoolIds } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import useGetPublicIfoV2Data from 'hooks/ifo/v2/useGetPublicIfoData'
import useGetWalletIfoV2Data from 'hooks/ifo/v2/useGetWalletIfoData'
import SmallCard from './SmallCard'
import Timer from './Timer'
import Achievement from './Achievement'

interface IfoFoldableCardProps {
  ifo: Ifo
  isInitiallyVisible: boolean
}

const getRibbonComponent = (status: IfoStatus, TranslateString: (translationId: number, fallback: string) => any) => {
  if (status === 'coming_soon') {
    return <CardRibbon variantColor="textDisabled" ribbonPosition="left" text={TranslateString(999, 'Coming Soon')} />
  }

  if (status === 'live') {
    return <CardRibbon variantColor="primary" ribbonPosition="left" text={TranslateString(999, 'LIVE!')} />
  }

  return null
}

const StyledCard = styled(Card)`
  max-width: 736px;
  width: 100%;
  margin: auto;
`

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

const FoldableContent = styled.div<{ isVisible: boolean; isActive: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  background: ${({ isActive, theme }) => (isActive ? theme.colors.gradients.bubblegum : theme.colors.dropdown)};
`

const CardsWrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
`

const StyledCardFooter = styled(CardFooter)`
  text-align: center;
  padding: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const IfoFoldableCard: React.FC<IfoFoldableCardProps> = ({ ifo, isInitiallyVisible }) => {
  const [isVisible, setIsVisible] = useState(isInitiallyVisible)
  const TranslateString = useI18n()
  const publicIfoData = useGetPublicIfoV2Data(ifo)
  const walletIfoData = useGetWalletIfoV2Data(ifo)

  const Ribbon = getRibbonComponent(publicIfoData.status, TranslateString)
  const isActive = publicIfoData.status !== 'finished' && ifo.isActive

  return (
    <StyledCard ribbon={Ribbon}>
      <Header ifoId={ifo.id}>
        <ExpandableButton expanded={isVisible} onClick={() => setIsVisible((prev) => !prev)} />
      </Header>
      <FoldableContent isVisible={isVisible} isActive={publicIfoData.status !== 'idle' && isActive}>
        {isActive && <Progress variant="flat" primaryStep={publicIfoData.progress} />}
        <CardBody>
          {isActive && <Timer publicIfoData={publicIfoData} />}
          <CardsWrapper>
            <SmallCard
              poolId={PoolIds.poolBasic}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
            />
            <SmallCard
              poolId={PoolIds.poolUnlimited}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
            />
          </CardsWrapper>
          <Achievement ifo={ifo} publicIfoData={publicIfoData} />
        </CardBody>
        <StyledCardFooter>
          <Button variant="text" endIcon={<ChevronUpIcon color="primary" />} onClick={() => setIsVisible(false)}>
            {TranslateString(999, 'Close')}
          </Button>
        </StyledCardFooter>
      </FoldableContent>
    </StyledCard>
  )
}

export default IfoFoldableCard
