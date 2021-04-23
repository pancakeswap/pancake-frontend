import React from 'react'
import { Text, Flex, Box, ErrorIcon, Button } from '@pancakeswap-libs/uikit'
import Banner from './Banner'

const MigrationV2 = () => {
  return (
    <Banner
      id="v2-migration"
      title={
        <Flex alignItems="center">
          <ErrorIcon color="white" width="32px" mr="16px" />
          <Text color="white" fontSize="24px" bold>
            MIGRATION DELAYED
          </Text>
        </Flex>
      }
    >
      <Box ml="48px">
        <Text color="warning" bold>
          The Migration to V2 will be delayed by several hours.
        </Text>
        <Text color="white" mb="16px">
          If you already migrated to V2 LP tokens, please unstake your V2 LP tokens.
        </Text>
        <Button as="a" href="https://hiccup.pancakeswap.finance/#/pool">
          Remove V2 liquidity
        </Button>
      </Box>
    </Banner>
  )
}

export default MigrationV2
