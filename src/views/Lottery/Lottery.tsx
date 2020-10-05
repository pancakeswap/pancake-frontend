import React, {useEffect} from 'react'
import styled from 'styled-components'

import {NavLink, Route, Switch, useParams, useRouteMatch} from 'react-router-dom'
import {useWallet} from 'use-wallet'

import Page from '../../components/Page'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import useSushi from '../../hooks/useSushi'
import Prize from "./components/prize";
import Ticket from "./components/ticket";
import Time from "./components/time";
import Winning from "./components/winning";


const Farm: React.FC = () => {
    const {account} = useWallet()
    const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const sushi = useSushi()
    const {ethereum} = useWallet()
    const {path} = useRouteMatch()

    const lotteryPrizeAmount = '100,000,000'

    const subtitleText = 'Spend CAKE to buy tickets, contributing to the lottery pot. Ticket purchases end approx. 30 minutes before lottery. Win prizes if 2, 3, or 4 of your ticket numbers match the winning numbers!'

    // return (
    //     <Switch>
    //         <Page>
    //             <Title style={{marginTop: '0.5em'}}>
    //                 💰
    //                 <br/>
    //                 WIN
    //             </Title>
    //             <Title2>{lotteryPrizeAmount} CAKE</Title2>
    //             <Subtitle>{subtitleText}</Subtitle>
    //             <StyledFarm>
    //                 <StyledCardWrapper>
    //                     <Prize/>
    //                     <Ticket/>
    //                 </StyledCardWrapper>
    //             </StyledFarm>
    //             <Time></Time>
    //             <Winning></Winning>
    //         </Page>
    //     </Switch>
    // )

    return (
        <StyledFarm>
            <div>
                |-----------------|<br/>
                | COMING&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                | SOON&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>
                |-----------------|<br/>
                (\__/) ||<br/>
                (•ㅅ•) ||<br/>
                / 　 づ<br/>

            </div>
        </StyledFarm>
    )

}

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size:56px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`


const Title2 = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size:56px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

const Subtitle = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size:20px;
  width: 50vw;
  text-align: center;
  font-weight: 600;
  margin-top: 0.8em;
`
// width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
const StyledCardWrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`

const StyledFarm = styled.div`
  margin-top: 2.5em;      
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

export default Farm
