import { Box, Flex, Text, NftIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { NftAttribute } from 'state/nftMarket/types'
import ExpandableCard from './ExpandableCard'

interface PropertiesCardProps {
  properties: NftAttribute[]
  rarity: { [key: string]: number }
}

// Map of known traits to human-readable text
const KNOWN_TRAITS_TEXT = {
  bunnyId: 'Bunny ID',
}

const SingleProperty: React.FC<React.PropsWithChildren<{ title: string; value: string | number; rarity: number }>> = ({
  title,
  value,
  rarity,
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
        {KNOWN_TRAITS_TEXT[title] ?? title}
      </Text>
      <Flex alignItems="center">
        <Text bold textTransform="uppercase" mr="4px">
          {value}
        </Text>
        {rarity && (
          <Text small color="textSubtle">
            ({rarity.toFixed(2)}%)
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

const PropertiesCard: React.FC<React.PropsWithChildren<PropertiesCardProps>> = ({ properties, rarity }) => {
  const { t } = useTranslation()
  const content = (
    <Box p="24px">
      {properties.map((property) => (
        <SingleProperty
          key={property.traitType}
          title={property.traitType}
          value={property.value}
          rarity={rarity[property.traitType]}
        />
      ))}
    </Box>
  )
  return <ExpandableCard title={t('Properties')} icon={<NftIcon width="24px" height="24px" />} content={content} />
}

export default PropertiesCard
