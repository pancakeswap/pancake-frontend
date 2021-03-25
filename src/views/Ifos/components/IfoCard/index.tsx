import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardRibbon } from '@pancakeswap-libs/uikit'
import { Ifo, IfoStatus } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import useGetPublicIfoData from 'hooks/useGetPublicIfoData'
import UnlockButton from 'components/UnlockButton'
import IfoCardHeader from './IfoCardHeader'
import IfoCardDetails from './IfoCardDetails'
import IfoCardActions from './IfoCardActions'
import IfoCardProgress from './IfoCardProgress'
import IfoCardTime from './IfoCardTime'

export interface IfoCardProps {
  ifo: Ifo
}

const StyledIfoCard = styled(Card)<{ ifoId: string }>`
  background-image: ${({ ifoId }) => `url('/images/ifos/${ifoId}-bg.svg')`};
  background-repeat: no-repeat;
  background-size: contain;
  padding-top: 112px;
  margin-left: auto;
  margin-right: auto;
  max-width: 437px;
  width: 100%;
`
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
  const { id, name, subTitle } = ifo
  const publicIfoData = useGetPublicIfoData(ifo)
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const Ribbon = getRibbonComponent(publicIfoData.status, TranslateString)

  return (
    <StyledIfoCard ifoId={id} ribbon={Ribbon} isActive={publicIfoData.status === 'live'}>
      <CardBody>
        <IfoCardHeader ifoId={id} name={name} subTitle={subTitle} />
        {publicIfoData.status !== 'finished' && ifo.isActive && (
          <>
            <IfoCardProgress progress={publicIfoData.progress} />
            <IfoCardTime
              status={publicIfoData.status}
              secondsUntilStart={publicIfoData.secondsUntilStart}
              secondsUntilEnd={publicIfoData.secondsUntilEnd}
              block={publicIfoData.startBlockNum}
            />
          </>
        )}
        {account ? <IfoCardActions ifo={ifo} publicIfoData={publicIfoData} /> : <UnlockButton width="100%" />}
      </CardBody>
      <IfoCardDetails ifo={ifo} publicIfoData={publicIfoData} />
    </StyledIfoCard>
  )
}

export default IfoCard
