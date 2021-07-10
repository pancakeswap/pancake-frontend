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
import { zombiePriceUsd } from '../../redux/get'

let accountAddress

const Graves: React.FC = () => {
  const { account } = useWeb3React()
  const [isAllowance, setIsAllowance] = useState(false)
  const [farmData, setFarmData] = useState(tableData)

  accountAddress = account
  const drFrankenstein = useDrFrankenstein()
  const zmbeContract = useERC20(getAddress(tokens.zmbe.address))
  const allowance = useIfoAllowance(zmbeContract, getDrFrankensteinAddress())
  const [bnbInBusd, setBnbInBusd] = useState(0)
  const [zombieGraveBalance, setZombieGraveBalance] = useState(BIG_ZERO)
  const [zombieAllowance, setZombieAllowance] = useState(0)

  useEffect(() => {
    if(account){
      getZombieContract().methods.allowance(accountAddress, getDrFrankensteinAddress()).call()
        .then(res => {
          setZombieAllowance(res)
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
        console.log("here")
        console.log(res.toString())
        setZombieAllowance(res)
      })
    drFrankenstein.methods.userInfo(pid, accountAddress).call()
      .then(res => {
        const newFarmData = farmData.map((data) => {
          if (data.pid === pid) {
            data.result = res
          }
          return data
        })

        setFarmData(newFarmData)
      })
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
        {farmData.map((data) => {
          return <Table zombieUsdPrice={zombiePriceUsd()}
                        updateResult={updateResult} updateAllowance={updateAllowance} zombieAllowance={zombieAllowance} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} details={data} key={data.id} />
        })}
      </div>
    </Page>
  )
}

export default Graves
