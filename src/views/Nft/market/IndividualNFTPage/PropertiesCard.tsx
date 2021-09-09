import React from 'react'
import { Box, Flex, Text, NftIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ExpandableCard from './ExpandableCard'
import { Collectible } from './types'

interface PropertiesCardProps {
  collectible: Collectible
}

const PropertiesCard: React.FC<PropertiesCardProps> = ({ collectible }) => {
  const { t } = useTranslation()
  const content = (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Bunny id')}
        </Text>
        <Text bold textTransform="uppercase">
          {collectible.nft.id}
        </Text>
      </Flex>
    </Box>
  )
  return <ExpandableCard title={t('Properties')} icon={<NftIcon width="24px" height="24px" />} content={content} />
}

export default PropertiesCard
