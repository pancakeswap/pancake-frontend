import React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, SearchIcon, Link } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ExpandableCard from './ExpandableCard'

interface DetailsCardProps {
  contractAddress: string
  ipfsJson: string
}

const LongTextContainer = styled(Text)`
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const DetailsCard: React.FC<DetailsCardProps> = ({ contractAddress, ipfsJson }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const content = (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Contract address')}
        </Text>
        <Link external href={getBscScanLink(contractAddress, 'address', chainId)}>
          <LongTextContainer bold>{contractAddress}</LongTextContainer>
        </Link>
      </Flex>
      {ipfsJson && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            IPFS JSON
          </Text>
          <Link external href={ipfsJson}>
            <LongTextContainer bold>{ipfsJson}</LongTextContainer>
          </Link>
        </Flex>
      )}
    </Box>
  )
  return <ExpandableCard title={t('Details')} icon={<SearchIcon width="24px" height="24px" />} content={content} />
}

export default DetailsCard
