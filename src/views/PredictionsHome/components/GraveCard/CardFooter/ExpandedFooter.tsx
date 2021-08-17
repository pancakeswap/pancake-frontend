import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Flex,
  Text,
  LinkExternal,
  Skeleton,
} from '@rug-zombie-libs/uikit'
import { auctionById } from '../../../../../redux/get'
import { BIG_ZERO } from '../../../../../utils/bigNumber'
import { useMausoleum } from '../../../../../hooks/useContract'

interface ExpandedFooterProps {
  id: number
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ id }) => {
  const { aid, artist, version } = auctionById(id)
  const mausoleum = useMausoleum(version)
  const [totalBids, setTotalBids] = useState(BIG_ZERO)
  useEffect(() => {
    mausoleum.methods.bidsLength(aid).call()
      .then(res => {
        setTotalBids(new BigNumber(res))
      })
  }, [aid, mausoleum.methods])
  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>Total bids:</Text>
        <Flex alignItems="flex-start">
          {!totalBids.isZero() ? (
            <div>{totalBids.toString()}</div>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal bold={false} small href={artist.twitter}>
          View NFT Artist
        </LinkExternal>
      </Flex>
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
