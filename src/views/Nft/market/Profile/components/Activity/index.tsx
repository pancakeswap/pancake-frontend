import React from 'react'
import { Flex, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useUserActivity } from 'state/nftMarket/hooks'
import useFetchUserNfts from '../../hooks/useFetchUserActivity'

const Activity = () => {
  const { account } = useWeb3React()
  useFetchUserNfts(account)
  const sortedActivity = useUserActivity()

  return (
    <>
      <span>Activity</span>
      <Flex flexDirection="column">
        {sortedActivity.map((activity) => (
          <Text key={activity.id}>{activity.id}</Text>
        ))}
      </Flex>
    </>
  )
}

export default Activity
