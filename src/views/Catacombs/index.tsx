import React, { useEffect, useState } from 'react'
import useEagerConnect from '../../hooks/useEagerConnect'
import { useCatacombsContract, useMultiCall } from '../../hooks/useContract'
import * as fetch from '../../redux/fetch'
import Entry from './components/Entry'
import { account } from '../../redux/get'
import Home from './components/Home'

const Catacombs: React.FC = (props) => {
  useEagerConnect()
  const multi = useMultiCall()
  const catacombs = useCatacombsContract()

  useEffect(() => {
    fetch.initialData(account(), multi)
  }, [multi])

  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    if (account()) {
      catacombs.methods.isUnlocked(account()).call()
        .then(
          res => {
            setUnlocked(res)
          })
    }
  }, [catacombs.methods])

  return (
    unlocked ? <Home /> : <Entry />
  )
}

export default Catacombs
