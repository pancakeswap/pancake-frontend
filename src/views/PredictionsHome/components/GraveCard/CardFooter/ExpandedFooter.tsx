import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
} from '@rug-zombie-libs/uikit'
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { useBlock } from 'state/hooks'
import { Pool } from 'state/types'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'
import tokens from '../../../../../config/constants/tokens'
import { GraveConfig } from '../../../../../config/constants/types'
import { account, auctionByAid } from '../../../../../redux/get'
import { BIG_ZERO } from '../../../../../utils/bigNumber'
import { useMausoleum } from '../../../../../hooks/useContract'

interface ExpandedFooterProps {
  aid: number
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ aid }) => {
  const { artist } = auctionByAid(aid)
  const mausoleum = useMausoleum()
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
