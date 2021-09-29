import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BaseLayout, Text } from '@catacombs-libs/uikit'
import Typewriter from 'typewriter-effect'
import CatacombsSVG from '../../images/catacombs.svg'
import CatacombsEntryBackgroundSVG from '../../images/Catacombs_Entry_650_x_650_px.svg'
import CatacombsPageSVG from '../../images/Catacombs_650_x_650_px.svg'
import useEagerConnect from '../../hooks/useEagerConnect'
import { useCatacombsContract, useMultiCall } from '../../hooks/useContract'
import * as fetch from '../../redux/fetch'
import Entry from './components/Entry'
import Main from './components/Main'
import Page from '../../components/layout/Page'
// import GraveStakingCard from '../Home/components/GraveStakingCard'
// import AnnouncementCard from '../Home/components/AnnouncementCard'
// import EnterGravesCard from '../Home/components/EnterGravesCard'
// import TotalValueLockedCard from '../Home/components/TotalValueLockedCard'
// import ZmbeStats from '../Home/components/ZmbeStats'
// import WhatsNewCard from '../Home/components/WhatsNewCard'
import Menu from '../../components/Catacombs/Menu'
import { useTranslation } from '../../contexts/Localization'
import './Catacombs.Styles.css'


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

const Catacombs: React.FC = (props) => {
  useEagerConnect()
  const multi = useMultiCall()
  const { account } = useWeb3React()
  const catacombs = useCatacombsContract()
  // const { t } = useTranslation()

  useEffect(() => {
    fetch.initialData(account, multi)
  }, [account, multi])

  if (account !== undefined) {
    catacombs.methods.isUnlocked(account).call()
      .then(
        res => {
          return (res ? <Main /> : <Entry />)
        }
      )
  }

  return (
    <Main />
  )
}

export default Catacombs
