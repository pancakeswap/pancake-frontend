import React, { useEffect, useRef, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import useEagerConnect from '../../hooks/useEagerConnect'
import { useCatacombsContract, useMultiCall } from '../../hooks/useContract'
import * as fetch from '../../redux/fetch'
import Entry from './components/Entry'
import Main from './components/Main'
import './Catacombs.Styles.css'

const Catacombs: React.FC = (props) => {
  useEagerConnect()
  const multi = useMultiCall()
  const { account } = useWeb3React()
  const catacombs = useCatacombsContract()

  useEffect(() => {
    fetch.initialData(account, multi)
  }, [account, multi])

  const [unlocked, setUnlocked] = useState(false)

  if (account !== undefined) {
    catacombs.methods.isUnlocked(account).call()
      .then(
        res => {
          setUnlocked(res)
        })
  }

  return (
    unlocked ? <Main /> : <Entry />
  )
}

export default Catacombs
