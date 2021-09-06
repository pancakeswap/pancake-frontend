import React from 'react'
import { Flex, Box, Text, IconButton, Heading, ArrowBackIcon, CardBody, Card } from '@pancakeswap/uikit'
import AvatarImage from './AvatarImage'
import BannerImage from './BannerImage'
import CollectionStatsWrapper from './CollectionStatsWrapper'

const Header = () => {
  return (
    <Flex flexDirection="column">
      <Box position="relative">
        <BannerImage src="/images/teams/cakers-banner.png" />
        <Box position="absolute" bottom={-68} left={-4}>
          <Flex alignItems="flex-end">
            <AvatarImage src="/images/nfts/flipper-md.png" />
            {/* IconLinks */}
            <IconButton as="a" href="https://www.google.com">
              <ArrowBackIcon width="20px" color="primary" />
            </IconButton>
          </Flex>
        </Box>
      </Box>
      <Flex
        flexDirection={['column', null, 'row']}
        justifyContent="space-between"
        alignItems={['flex-start', null, 'flex-end']}
        mt={80}
      >
        {/* TextContent */}
        <Flex flexDirection="column" mb={[16, null, 0]} mr={[0, null, 16]}>
          <Heading mb={12} scale="lg" color="secondary">
            @MissPiggy
          </Heading>
          <Text bold color="primary">
            0x022....
          </Text>
        </Flex>
        {/* Stats */}
        <CollectionStatsWrapper>
          <Flex justifyContent="space-around">
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="12px" mb="8px" color="textSubtle">
                NFT Collected
              </Text>
              <Text bold>42</Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="12px" mb="8px" color="textSubtle">
                Points
              </Text>
              <Text bold>345</Text>
            </Flex>
            <Flex flexDirection="column" alignItems="center">
              <Text fontSize="12px" mb="8px" color="textSubtle">
                Achievements
              </Text>
              <Text bold>3</Text>
            </Flex>
          </Flex>
        </CollectionStatsWrapper>
      </Flex>
    </Flex>
  )
}

export default Header
