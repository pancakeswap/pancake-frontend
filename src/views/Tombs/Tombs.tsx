/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { getBnbPriceinBusd } from 'state/hooks'
import { Heading } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useDrFrankenstein } from 'hooks/useContract'
import { getDrFrankensteinAddress } from 'utils/addressHelpers'
import Page from '../../components/layout/Page'
import Table from './Table'
import '../Graves/Graves.Styles.css'
import tableData from './data'
import { BIG_ZERO } from '../../utils/bigNumber'
import { zombiePriceUsd } from '../../redux/get'


let accountAddress

const Tombs: React.FC = ( ) => {

  const { account } = useWeb3React()
  const [tombsData, setTombsData] = useState(tableData)

  accountAddress = account
  const drFrankenstein = useDrFrankenstein()
  const [bnbInBusd, setBnbInBusd] = useState(0)

  useEffect(() => {
    if (accountAddress) {
      const newTombsData = tableData.map((tokenInfo) => {
        drFrankenstein.methods.userInfo(tokenInfo.pid, accountAddress).call()
          .then(res => {
            tokenInfo.result = res
          })
        drFrankenstein.methods.poolInfo(tokenInfo.pid).call().then(res => {
          tokenInfo.poolInfo = res
        })
        drFrankenstein.methods.pendingZombie(tokenInfo.pid, accountAddress).call()
          .then(res => {
            tokenInfo.pendingZombie = res
          })
        return tokenInfo
      })
      setTombsData(newTombsData)
      getBnbPriceinBusd().then((res) => {
        setBnbInBusd(res.data.price)
      })
    }

  }, [drFrankenstein.methods])


  const [isAllowance, setIsAllowance] = useState(false)
  const [reservesUsd, setReservesUsd] = useState([BIG_ZERO, BIG_ZERO])



  const updateResult = (pid) => {
    drFrankenstein.methods.userInfo(pid, accountAddress).call()
      .then(res => {
        const newTombsData = tombsData.map((data) => {
          if (data.pid === pid) {
            data.result = res
          }
          return data
        })
        setTombsData(newTombsData)
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
          Tombs
        </Heading>
        <Heading color='text'>
          Stake $ZMBE to Earn NFTs
        </Heading>
      </PageHeader>
      <div>
        {tombsData.map((data) => {
          return <Table updateResult={updateResult} updateAllowance={updateAllowance} zombieUsdPrice={zombiePriceUsd()} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} details={data} key={data.id} />
        })}
      </div>
    </Page>
  )
}

export default Tombs
