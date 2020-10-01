import React, {useEffect} from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/cakecat.png'

import {NavLink, Route, Switch, useParams, useRouteMatch} from 'react-router-dom'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'

import Page from '../../components/Page'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import useSushi from '../../hooks/useSushi'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import {getContract} from '../../utils/erc20'
import {getMasterChefContract} from '../../sushi/utils'
import Spacer from "../../components/Spacer";
import Syrup from "../Stake/components/Syrup";
import Harvest from "../Stake/components/Harvest";
import Stake from "../Stake/components/Stake";
import FarmCards from "../Farms/components/FarmCards";


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

    // const lpContract = useMemo(() => {
    //   return getContract(ethereum as provider, lpTokenAddress)
    // }, [ethereum, lpTokenAddress])

    // const { onRedeem } = useRedeem(getMasterChefContract(sushi))

    // const lpTokenName = useMemo(() => {
    //   return lpToken.toUpperCase()
    // }, [lpToken])

    // const earnTokenName = useMemo(() => {
    //   return earnToken.toUpperCase()
    // }, [earnToken])

    return (
        <Switch>
            <Page>
                <Title style={{marginTop: '1.5em'}}>💰</Title>
                <Title>WIN</Title>
                <Title2>{lotteryPrizeAmount} CAKE</Title2>
                <Subtitle>{subtitleText}</Subtitle>
            </Page>
        </Switch>
    )
}

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size:36px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`


const Title2 = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size:36px;
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

export default Farm
