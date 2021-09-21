import React from 'react'
import { Box, Flex, Text, SearchIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ExpandableCard from './ExpandableCard'
import { Collectible } from './types'

interface DetailsCardProps {
  collectible: Collectible
}

const DetailsCard: React.FC<DetailsCardProps> = ({ collectible }) => {
  const { t } = useTranslation()
  const content = (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Contract address')}
        </Text>
        <Text bold textTransform="uppercase">
          {collectible.nft.id}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Token id')}
        </Text>
        <Text bold textTransform="uppercase">
          {collectible.nft.id}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          IPFS JSON
        </Text>
        <Text bold textTransform="uppercase">
          {collectible.nft.id}
        </Text>
      </Flex>
    </Box>
  )
  return <ExpandableCard title={t('Details')} icon={<SearchIcon width="24px" height="24px" />} content={content} />
}

export default DetailsCard
