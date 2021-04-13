import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@pancakeswap-libs/uikit'

const StyledCardHeader: React.FC<{
  poolImage: string
  earningTokenSymbol: string
  stakingTokenSymbol: string
}> = ({ poolImage, earningTokenSymbol, stakingTokenSymbol }) => {
  return (
    <CardHeader>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Heading size="lg">Earn {earningTokenSymbol}</Heading>
          <Text color="textSubtle">Stake {stakingTokenSymbol}</Text>
        </Flex>
        <Image src={`/images/pools/${poolImage}`} alt={earningTokenSymbol} width={64} height={64} />
      </Flex>
    </CardHeader>
  )
}

export default StyledCardHeader
