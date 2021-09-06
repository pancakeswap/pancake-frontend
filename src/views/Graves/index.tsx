/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import PageHeader from 'components/PageHeader'
import { Flex, Heading, LinkExternal } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { getDrFrankensteinAddress } from 'utils/addressHelpers'
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './Graves.Styles.css'
import { grave, initialData, initialGraveData } from '../../redux/fetch'
import { graves, zombiePriceUsd } from '../../redux/get'
import { useMultiCall } from '../../hooks/useContract'
import GraveTabButtons from './components/GraveTabButtons'

let accountAddress

const filterGraves = (i) => {
  switch(i) {
    case 0: // All
      return graves()
      break
    case 1: // Featured
      return graves().filter(g => g.isFeatured)
      break
    case 2: // Legendary
      return graves().filter(g => g.rarity === "Legendary")
      break
    case 3: // Rare
      return graves().filter(g => g.rarity === "Rare")
      break
    case 4: // Uncommon
      return graves().filter(g => g.rarity === "Uncommon")
      break
    case 5: // Common
      return graves().filter(g => g.rarity === "Common")
      break
    case 6: // Retired
      return graves().filter(g => g.isRetired)
      break
    default:
      return graves()
      break
  }
}

const Graves: React.FC = () => {
  const { account } = useWeb3React()
  const [isAllowance, setIsAllowance] = useState(false)
  const [farmData, setFarmData] = useState(graves())
  const [filter, setFilter] = useState(0)
  const [stakedOnly, setStakedOnly] = useState(false)
  const multi = useMultiCall()
  useEffect(() => {
    initialData(account, multi)
    initialGraveData(undefined, setFarmData)
  }, [account, multi])

  accountAddress = account
  const [bnbInBusd, setBnbInBusd] = useState(0)

  const updateResult = (pid) => {
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

    const visibleGraves = stakedOnly ? filterGraves(filter).filter(g => !g.userInfo.amount.isZero()) : filterGraves(filter).filter(g => !g.isRetired || filter === 6)
  return (
    <>
      <PageHeader background='#101820'>
        <Flex justifyContent='space-between' flexDirection={['column', null, 'row']}>
          <Flex flexDirection='column' mr={['8px', 0]}>
            <Heading as='h1' size='xxl' color='secondary' mb='24px'>
              Graves
            </Heading>
            <Heading size='md' color='text'>
              Stake $ZMBE to Earn NFTs
            </Heading>
            <br/>
            <LinkExternal href="https://rugzombie.medium.com/new-basic-grave-retiring-old-grave-on-aug-30th-54fd10eb3654">
              Learn more about the RugZombie Common grave migration.
            </LinkExternal>
          </Flex>
        </Flex>
      </PageHeader>
      <Page>
        <GraveTabButtons setFilter={setFilter} stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
        <div>
          {visibleGraves.map((g, index) => {
            return <Table zombieUsdPrice={zombiePriceUsd()}
                          updateResult={updateResult} updateAllowance={updateAllowance} bnbInBusd={bnbInBusd}
                          isAllowance={isAllowance} pid={g.pid} key={g.pid} />
          })}
        </div>
      </Page>
    </>
  )
}

export default Graves
