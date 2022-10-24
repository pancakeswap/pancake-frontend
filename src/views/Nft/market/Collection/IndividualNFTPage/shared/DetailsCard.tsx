import styled from 'styled-components'
import { Box, Flex, Text, SearchIcon, Link } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ExpandableCard from './ExpandableCard'

interface DetailsCardProps {
  contractAddress: string
  ipfsJson: string
  count?: number
  rarity?: number
}

const LongTextContainer = styled(Text)`
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const DetailsCard: React.FC<React.PropsWithChildren<DetailsCardProps>> = ({
  contractAddress,
  ipfsJson,
  count,
  rarity,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const ipfsLink = ipfsJson ? uriToHttp(ipfsJson)[0] : null
  const content = (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Contract address')}
        </Text>
        <Link external href={getBlockExploreLink(contractAddress, 'address', chainId)}>
          <LongTextContainer bold>{contractAddress}</LongTextContainer>
        </Link>
      </Flex>
      {ipfsLink && (
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            IPFS JSON
          </Text>
          <Link external href={ipfsLink}>
            <LongTextContainer bold>{ipfsLink}</LongTextContainer>
          </Link>
        </Flex>
      )}
      {count && (
        <Flex justifyContent="space-between" alignItems="center" mb="16px" mr="4px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Supply Count')}
          </Text>
          <LongTextContainer bold>{formatNumber(count, 0, 0)}</LongTextContainer>
        </Flex>
      )}
      {rarity && (
        <Flex justifyContent="space-between" alignItems="center" mr="4px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Rarity')}
          </Text>
          <LongTextContainer bold>{`${formatNumber(rarity, 0, 2)}%`}</LongTextContainer>
        </Flex>
      )}
    </Box>
  )
  return <ExpandableCard title={t('Details')} icon={<SearchIcon width="24px" height="24px" />} content={content} />
}

export default DetailsCard
