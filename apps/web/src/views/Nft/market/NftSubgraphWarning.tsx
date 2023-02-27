import { Flex, Text, Message } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'

const StyledAnchor = styled.a`
  display: inline-flex;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    text-decoration: underline;
  }
`

const NftSubgraphWarning: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="center" margin="24px">
      <Flex maxWidth={500}>
        <Message variant="warning">
          <Text>
            {t(
              'Due to an ongoing Subgraph indexing issue from the underlying infrastructure provider. The PancakeSwap NFT marketplace is currently showing outdated data. Continuing trading may be subject to the risk of executing orders at unexpected prices and loss of funds. We recommend not to trade until the issue is resolved. Follow our ',
            )}
            <StyledAnchor target="_blank" rel="noreferrer noopener" href="https://twitter.com/pancakeswap/">
              Twitter
            </StyledAnchor>{' '}
            {t('for the latest update.')}
          </Text>
        </Message>
      </Flex>
    </Flex>
  )
}

export default NftSubgraphWarning
