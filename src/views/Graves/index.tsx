/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { Flex, Heading } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { getDrFrankensteinAddress } from 'utils/addressHelpers'
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './Graves.Styles.css'
import { grave, initialData, initialGraveData } from '../../redux/fetch'
import { graves, zombiePriceUsd } from '../../redux/get'
import { useMultiCall } from '../../hooks/useContract'

let accountAddress

const Graves: React.FC = () => {
  const { account } = useWeb3React()
  const [isAllowance, setIsAllowance] = useState(false)
  const [farmData, setFarmData] = useState(graves())
  // const [userData, setUserData] = useState(graves())
  const multi = useMultiCall()
  useEffect(() => {
    initialData(account, multi)
    initialGraveData(undefined, setFarmData)
  }, [account, multi])

  accountAddress = account
  const [bnbInBusd, setBnbInBusd] = useState(0)

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
    <>
    <PageHeader background="#101820">
      <Flex justifyContent='space-between' flexDirection={['column', null, 'row']}>
        <Flex flexDirection='column' mr={['8px', 0]}>
          <Heading as='h1' size='xxl' color='secondary' mb='24px'>
            Graves
          </Heading>
          <Heading size='md' color='text'>
            Stake $ZMBE to Earn NFTs
          </Heading>
        </Flex>
      </Flex>
    </PageHeader>
    <Page >
      <div>
        {graves().map((g) => {
          return <Table zombieUsdPrice={zombiePriceUsd()}
                        updateResult={updateResult} updateAllowance={updateAllowance} bnbInBusd={bnbInBusd}
                        isAllowance={isAllowance} pid={g.pid} key={g.id} />
        })}
      </div>
    </Page>
    </>
  )
}

export default Graves
