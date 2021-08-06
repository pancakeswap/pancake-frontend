/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { getBnbPriceinBusd } from 'state/hooks'
import { Flex, Heading } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useDrFrankenstein } from 'hooks/useContract'
import { getDrFrankensteinAddress } from 'utils/addressHelpers'
import Page from '../../components/layout/Page'
import Table from './Table'
import '../Graves/Graves.Styles.css'
import tableData from './data'
import { BIG_ZERO } from '../../utils/bigNumber'
import { tombs } from '../../redux/get'


let accountAddress

const Tombs: React.FC = ( ) => {
  const { account } = useWeb3React()
  const [tombsData, setTombsData] = useState([])

  accountAddress = account
  const drFrankenstein = useDrFrankenstein()
  const [bnbInBusd, setBnbInBusd] = useState(0)

  useEffect(() => {
    if (accountAddress) {
      const newTombsData = tombs().map((tomb) => {
        drFrankenstein.methods.userInfo(tomb.pid, accountAddress).call()
          .then(res => {
            tomb.result = res
          })
        drFrankenstein.methods.poolInfo(tomb.pid).call().then(res => {
          tomb.poolInfo = res
        })
        drFrankenstein.methods.pendingZombie(tomb.pid, accountAddress).call()
          .then(res => {
            tomb.userInfo.pendingZombie = res
          })
        return tomb
      })
      setTombsData(newTombsData)
      getBnbPriceinBusd().then((res) => {
        setBnbInBusd(res.data.price)
      })
    }

  }, [drFrankenstein.methods])

  const [isAllowance, setIsAllowance] = useState(false)



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
    <>
    <PageHeader background="#101820">
      <Flex justifyContent='space-between' flexDirection={['column', null, 'row']}>
        <Flex flexDirection='column' mr={['8px', 0]}>
          <Heading as='h1' size='xxl' color='secondary' mb='24px'>
            Tombs
          </Heading>
          <Heading size='md' color='text'>
            Stake LP tokens to earn
          </Heading>
        </Flex>
      </Flex>
    </PageHeader>
    <Page >
      <div>
        {tombsData.map((data) => {
          return <Table updateResult={updateResult} updateAllowance={updateAllowance} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} details={data} key={data.id} />
        })}
      </div>
    </Page>
    </>
  )
}

export default Tombs
