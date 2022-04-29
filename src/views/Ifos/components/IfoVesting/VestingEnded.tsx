import React from 'react'
import { BalanceWithLoading } from 'components/Balance'
import { Box, Flex, Text, Button } from '@pancakeswap/uikit'
import { ListLogo } from 'components/Logo'

const VestingEnded: React.FC = () => {
  return (
    <Box>
      <Flex justifyContent="space-between" mb="22px">
        <BalanceWithLoading bold decimals={6} value={20.1233} fontSize="20px" />
        <Flex alignSelf="center">
          <Text fontSize="14px" mr="4px" style={{ alignSelf: 'center' }}>
            HOTCROSS
          </Text>
          <ListLogo logoURI="https://pancakeswap.finance/images/tokens/0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c.png" />
        </Flex>
      </Flex>
      <Button width="100%">Claim All</Button>
    </Box>
  )
}

export default VestingEnded
