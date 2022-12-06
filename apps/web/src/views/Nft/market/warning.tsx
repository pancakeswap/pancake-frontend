import { Flex, Text, Message, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const NftSubgraphWarning: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="center" margin="24px">
      <Flex maxWidth={500}>
        <Message variant="warning">
          <Text>
            {t(
              'Due to a subgraph indexing issue, PancakeSwap NFT marketplace is currently not available. This is a subgraph indexing issue, not from PancakeSwap.',
            )}
            <LinkExternal href="https://status.thegraph.com/incidents/swdh5pq0f34l">
              {t('You can track it here')}
            </LinkExternal>
          </Text>
        </Message>
      </Flex>
    </Flex>
  )
}

export default NftSubgraphWarning
