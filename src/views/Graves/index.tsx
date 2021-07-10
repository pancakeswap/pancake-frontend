/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { Heading } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import { useIfoAllowance } from 'hooks/useAllowance'
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
  const [farmData, setFarmData] = useState(tableData)

  accountAddress = account
  const drFrankenstein = useDrFrankenstein()
  const zmbeContract = useERC20(getAddress(tokens.zmbe.address))
  const [bnbInBusd, setBnbInBusd] = useState(0)
  const [zombieGraveBalance, setZombieGraveBalance] = useState(BIG_ZERO)
  const [allowance, setAllowance] = useState(zombieAllowance())

  useEffect(() => {
    if(account){
      getZombieContract().methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
        .then(res => {
          console.log("here")
          console.log(res.toString())
          setAllowance(res)
        })
    }
    // eslint-disable-next-line eqeqeq
    const newFarmData = tableData.map((graveInfo) => {
      if (account) {
        drFrankenstein.methods.userInfo(graveInfo.pid, account).call()
          .then(res => {
            graveInfo.result = res
          })
      }
      drFrankenstein.methods.poolInfo(graveInfo.pid).call().then(res => {
        graveInfo.poolInfo = res
      })
      if (account) {
        drFrankenstein.methods.pendingZombie(graveInfo.pid, account).call()
          .then(res => {
            graveInfo.pendingZombie = res
          })
      }
      if (graveInfo.pid !== 0) {
        getBep20Contract(graveInfo.stakingToken).methods.balanceOf(getDrFrankensteinAddress()).call()
          .then(res => {
            graveInfo.totalGraveAmount = res
          })
      }
      return graveInfo
    })

    getZombieContract().methods.balanceOf(getDrFrankensteinAddress()).call()
      .then(totalZombieBalance => {
        let temp = new BigNumber(totalZombieBalance)
        tableData.forEach(table => {
          temp = temp.minus(table.totalGraveAmount)
        })
        newFarmData[0].totalGraveAmount = temp.toString()
        setFarmData(newFarmData)
        getBnbPriceinBusd().then((res) => {
          setBnbInBusd(res.data.price)
        })
      })
  }, [account, drFrankenstein.methods, zombieGraveBalance])

  const updateResult = (pid) => {
    getZombieContract().methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
      .then(res => {
        setAllowance(res)
      })
    grave(pid)
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

    console.log(graves())

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
        {graves().map((gravePayload) => {
          return <Table zombieUsdPrice={zombiePriceUsd()}
                        updateResult={updateResult} updateAllowance={updateAllowance} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} details={gravePayload} key={gravePayload.id} />
        })}
      </div>
    </Page>
  )
}

export default Graves
