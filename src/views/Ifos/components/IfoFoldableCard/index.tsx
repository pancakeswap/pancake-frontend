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
} from '@pancakeswap/uikit'
import { Ifo, IfoStatus, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'hooks/ifo/types'
import { useTranslation } from 'contexts/Localization'
import IfoPoolCard from './IfoPoolCard'
import Timer from './Timer'
import Achievement from './Achievement'

interface IfoFoldableCardProps {
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isInitiallyVisible: boolean
}

const getRibbonComponent = (ifo: Ifo, status: IfoStatus, t: any) => {
  if (status === 'coming_soon') {
    return <CardRibbon variantColor="textDisabled" ribbonPosition="left" text={t('Coming Soon')} />
  }

  if (status === 'live' || (status === 'finished' && ifo.isActive)) {
    return (
      <CardRibbon
        variantColor="primary"
        ribbonPosition="left"
        style={{ textTransform: 'uppercase' }}
        text={status === 'live' ? `${t('Live')}!` : `${t('Finished')}!`}
      />
    )
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

const CardsWrapper = styled.div<{ singleCard: boolean }>`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: ${({ singleCard }) => (singleCard ? '1fr' : '1fr 1fr')};
    justify-items: ${({ singleCard }) => (singleCard ? 'center' : 'unset')};
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  text-align: center;
  padding: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`

const IfoFoldableCard: React.FC<IfoFoldableCardProps> = ({ ifo, publicIfoData, walletIfoData, isInitiallyVisible }) => {
  const [isVisible, setIsVisible] = useState(isInitiallyVisible)
  const { t } = useTranslation()

  const Ribbon = getRibbonComponent(ifo, publicIfoData.status, t)
  const isActive = publicIfoData.status !== 'finished' && ifo.isActive

  return (
    <StyledCard ribbon={Ribbon}>
      <Header ifoId={ifo.id}>
        <ExpandableButton expanded={isVisible} onClick={() => setIsVisible((prev) => !prev)} />
      </Header>
      <FoldableContent isVisible={isVisible} isActive={publicIfoData.status !== 'idle' && isActive}>
        {isActive && <Progress variant="flat" primaryStep={publicIfoData.progress} />}
        <StyledCardBody>
          {isActive && <Timer publicIfoData={publicIfoData} />}
          <CardsWrapper singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}>
            {publicIfoData.poolBasic && walletIfoData.poolBasic && (
              <IfoPoolCard
                poolId={PoolIds.poolBasic}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
              />
            )}
            <IfoPoolCard
              poolId={PoolIds.poolUnlimited}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
            />
          </CardsWrapper>
          <Achievement ifo={ifo} publicIfoData={publicIfoData} />
        </StyledCardBody>
        <StyledCardFooter>
          <Button variant="text" endIcon={<ChevronUpIcon color="primary" />} onClick={() => setIsVisible(false)}>
            {t('Close')}
          </Button>
        </StyledCardFooter>
      </FoldableContent>
    </StyledCard>
  )
}

export default IfoFoldableCard
