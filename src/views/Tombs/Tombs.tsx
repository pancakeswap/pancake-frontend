/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { getBnbPriceinBusd } from 'state/hooks'
import { Flex, Heading } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useDrFrankenstein, useMultiCall } from 'hooks/useContract'
import { getDrFrankensteinAddress } from 'utils/addressHelpers'
import Page from '../../components/layout/Page'
import Table from './Table'
import '../Graves/Graves.Styles.css'
import { tombs } from '../../redux/get'
import { initialTombData } from '../../redux/fetch'

let accountAddress

const Tombs: React.FC = ( ) => {
  const { account } = useWeb3React()
  const [tombsData, setTombsData] = useState([])
  const multi = useMultiCall()
  accountAddress = account
  const drFrankenstein = useDrFrankenstein()
  const [bnbInBusd, setBnbInBusd] = useState(0)
  const [updatePoolInfo, setUpdatePoolInfo] = useState(false)
  const [updateUserInfo, setUpdateUserInfo] = useState(false)

  useEffect(() => {
    initialTombData(
      multi,
      { update: updatePoolInfo, setUpdate: setUpdatePoolInfo },
      { update: updateUserInfo, setUpdate: setUpdateUserInfo }
    )
  }, [drFrankenstein.methods, multi, updatePoolInfo, updateUserInfo])

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
        {tombs().sort((a, b) => a.id - b.id).map((t) => {
          return <Table pid={t.pid} updateResult={updateResult} updateAllowance={updateAllowance} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} key={t.id} />
        })}
      </div>
    </Page>
    </>
  )
}

export default Tombs
