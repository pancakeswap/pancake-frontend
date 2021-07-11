/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { Heading } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import { getBnbPriceinBusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import { useDrFrankenstein, useERC20, useZombie } from '../../hooks/useContract'
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './Graves.Styles.css'
import tableData from './data'
import { getBep20Contract, getZombieContract } from '../../utils/contractHelpers'
import { BIG_ZERO } from '../../utils/bigNumber'
import { zombieAllowance, zombiePriceUsd, graves } from '../../redux/get'
import { grave, initialGraveData } from '../../redux/fetch'

let accountAddress

const Graves: React.FC = () => {
  const { account } = useWeb3React()
  initialGraveData()
  const [isAllowance, setIsAllowance] = useState(false)
  const [farmData, setFarmData] = useState(graves())

  accountAddress = account
  const [bnbInBusd, setBnbInBusd] = useState(0)

console.log('reloaded index')
  const updateResult = (pid) => {
    // getZombieContract().methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
    //   .then(res => {
    //     setAllowance(res)
    //   })
    grave(pid)
    // setFarmData(graves())
  }

    const updateAllowance = (tokenContact, pid) => {
      tokenContact.methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
        .then(res => {
          if (parseInt(res.toString()) !== 0) {
            setIsAllowance(true)
          } else {
            setIsAllowance(false)
          }
          updateResult(pid)
        })
    }

  return (
    <Page className='innnerContainer'>
      <PageHeader background='none'>
        <Heading color='secondary' mb='24px'>
          Graves
        </Heading>
        <Heading color='text'>
          Stake $ZMBE to Earn NFTs
        </Heading>
      </PageHeader>
      <div>
        {graves().map((g) => {
          return <Table zombieUsdPrice={zombiePriceUsd()}
                        updateResult={updateResult} updateAllowance={updateAllowance} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} pid={g.pid} key={g.id} />
        })}
      </div>
    </Page>
  )
}

export default Graves
