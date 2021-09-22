import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BaseLayout } from '@rug-zombie-libs/uikit'
import CatacombsSVG from '../../images/catacombs.svg'
import useEagerConnect from '../../hooks/useEagerConnect'
import { useMultiCall } from '../../hooks/useContract'
import * as fetch from '../../redux/fetch'
import Title from './components/Title'
import Page from '../../components/layout/Page'
import GraveStakingCard from '../Home/components/GraveStakingCard'
import AnnouncementCard from '../Home/components/AnnouncementCard'
import EnterGravesCard from '../Home/components/EnterGravesCard'
import TotalValueLockedCard from '../Home/components/TotalValueLockedCard'
import ZmbeStats from '../Home/components/ZmbeStats'
import WhatsNewCard from '../Home/components/WhatsNewCard'
import Menu from '../../components/Catacombs/Menu'

const Container = styled.div`
  display: flex;
  justify-content: center;
`
const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  & > div {
    grid-column: span 6;
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Catacombs: React.FC = () => {
    useEagerConnect()
    const multi = useMultiCall()
    const {account} = useWeb3React()
    useEffect(() => {
        fetch.initialData(account, multi)
    }, [account, multi])

    return (
    <Menu>
        { true ? <>
              <Title/>
              <Page>
                  <div>
                      <Cards>
                          <GraveStakingCard />
                          <AnnouncementCard />
                      </Cards>
                      <Cards>
                          <EnterGravesCard/>
                          <TotalValueLockedCard/>
                          <ZmbeStats />
                          <WhatsNewCard/>
                      </Cards>
                  </div>
              </Page>
          </> :
            <Container>
                <img src={CatacombsSVG} alt='catacombs-rug-zombie' />
            </Container>}
    </Menu>
  )
}

export default Catacombs