import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, CardHeader } from '@pancakeswap-libs/uikit'
import { Ifo } from 'config/constants/types'
import useGetPublicIfoData from 'hooks/useGetPublicIfoData'
import UnlockButton from 'components/UnlockButton'
import IfoCardHeader from './IfoCardHeader'
import IfoCardDetails from './IfoCardDetails'
import IfoCardActions from './IfoCardActions'
import IfoCardTime from './IfoCardTime'

export interface IfoCardProps {
  ifo: Ifo
}

const StyledIfoCard = styled(Card)<{ ifoId: string }>`
  margin-left: auto;
  margin-right: auto;
  max-width: 437px;
  width: 100%;
`

const IfoCard: React.FC<IfoCardProps> = ({ ifo }) => {
  const { id, name, subTitle } = ifo
  const publicIfoData = useGetPublicIfoData(ifo)
  const { account } = useWeb3React()

  return (
    <StyledIfoCard ifoId={id} isActive={publicIfoData.status === 'live'}>
      <CardHeader>Header</CardHeader>
      <CardBody>
        <IfoCardHeader ifoId={id} name={name} subTitle={subTitle} />
        {publicIfoData.status !== 'finished' && ifo.isActive && (
          <IfoCardTime
            status={publicIfoData.status}
            secondsUntilStart={publicIfoData.secondsUntilStart}
            secondsUntilEnd={publicIfoData.secondsUntilEnd}
            block={publicIfoData.startBlockNum}
          />
        )}
        {account ? <IfoCardActions ifo={ifo} publicIfoData={publicIfoData} /> : <UnlockButton width="100%" />}
      </CardBody>
      <IfoCardDetails ifo={ifo} publicIfoData={publicIfoData} />
    </StyledIfoCard>
  )
}

export default IfoCard
