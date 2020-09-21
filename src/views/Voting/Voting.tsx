import React, { useEffect } from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/cakecat.png'

import { useParams } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import Page from '../../components/Page'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import useSushi from '../../hooks/useSushi'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import { getContract } from '../../utils/erc20'
import { getMasterChefContract } from '../../sushi/utils'



const Farm: React.FC = () => {
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sushi = useSushi()
  const { ethereum } = useWallet()

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

const StyledFarm = styled.div`
  margin-top: 160px;
  text-align: center;
  > div{
    display:  inline-block;
    text-align: left;
  }
`


export default Farm
