import React from 'react'
import { Image, Flex, Text } from '@pancakeswap/uikit'
import { AskOrder, Transaction, NFT } from 'state/nftMarket/types'
import styled from 'styled-components'
import { GridItem, TableRow } from './TableStyles'

const RoundedImage = styled(Image)`
  & > img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

interface ActivityRowProps {
  activity: Transaction | AskOrder
  nftMetadata: NFT
}

const ActivityRow: React.FC<ActivityRowProps> = ({ activity, nftMetadata }) => {
  return (
    <TableRow>
      <GridItem width="100%">
        <RoundedImage src={nftMetadata.image.thumbnail} alt={nftMetadata.name} width={64} height={64} mx="16px" />
        <Flex flexDirection="column">
          <Text color="textSubtle" fontSize="14px">
            {nftMetadata.collectionName}
          </Text>
          <Text bold>{nftMetadata.name}</Text>
        </Flex>
      </GridItem>
    </TableRow>
  )
}

export default ActivityRow
