import React from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import CardHeader from './components/CardHeader'
import Menu from './components/Menu'

const PublicProfile = () => {
  const { account } = useWallet()

  return (
    <>
      <Menu activeIndex={1} />
      <div>
        <Card>
          <CardHeader>
            <Heading size="xl">@Username</Heading>
            <Text>{account}</Text>
          </CardHeader>
          <CardBody>public profile</CardBody>
        </Card>
      </div>
    </>
  )
}

export default PublicProfile
