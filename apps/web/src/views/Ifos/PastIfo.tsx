import { Container } from '@pancakeswap/uikit'

import { useInActiveIfoConfigs } from 'hooks/useIfoConfig'

import IfoCardV1Data from './components/IfoCardV1Data'
import IfoCardV2Data from './components/IfoCardV2Data'
import IfoCardV3Data from './components/IfoCardV3Data'
import { IfoCardV7Data } from './components/IfoCardV7Data'
import { IfoCardV8Data } from './components/IfoCardV8Data'
import IfoLayout from './components/IfoLayout'

const PastIfo = () => {
  const inactiveIfo = useInActiveIfoConfigs()

  return (
    <Container>
      <IfoLayout maxWidth="736px" m="auto" width="100%" id="past-ifos" py={['24px', '24px', '40px']}>
        {inactiveIfo?.map((ifo) => {
          switch (ifo.version) {
            case 1:
              return <IfoCardV1Data key={ifo.id} ifo={ifo} />
            case 2:
              return <IfoCardV2Data key={ifo.id} ifo={ifo} />
            case 3:
            case 3.1:
            case 3.2:
              return <IfoCardV3Data key={ifo.id} ifo={ifo} />
            case 7:
              return <IfoCardV7Data key={ifo.id} ifo={ifo} />
            case 8:
              return <IfoCardV8Data key={ifo.id} ifo={ifo} />
            default:
              return null
          }
        })}
      </IfoLayout>
    </Container>
  )
}

export default PastIfo
