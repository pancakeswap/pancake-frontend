import React from 'react'
import { Image, Flex, Text, Td, IconButton, Link, OpenNewIcon, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { NftToken } from 'state/nftMarket/types'
import { Price } from '@pancakeswap/sdk'
import styled from 'styled-components'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Activity } from '../../hooks/useUserActivity'
import ActivityEventText from './ActivityEventText'
import ActivityPrice from './ActivityPrice'
import MobileModal from './MobileModal'

const RoundedImage = styled(Image)`
  & > img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

interface ActivityRowProps {
  activity: Activity
  nft: NftToken
  bnbBusdPrice: Price
}

const ActivityRow: React.FC<ActivityRowProps> = ({ activity, bnbBusdPrice, nft }) => {
  const { chainId } = useActiveWeb3React()
  const { isXs, isSm } = useMatchBreakpoints()
  const priceAsFloat = parseFloat(activity.price)
  const timestampAsMs = parseFloat(activity.timestamp) * 1000
  const localeTimestamp = new Date(timestampAsMs).toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  const [onPresentMobileModal] = useModal(
    <MobileModal nft={nft} activity={activity} localeTimestamp={localeTimestamp} bnbBusdPrice={bnbBusdPrice} />,
  )

  return (
    <tr {...((isXs || isSm) && { onClick: onPresentMobileModal })}>
      <Td>
        <Flex justifyContent="flex-start" alignItems="center" flexDirection={['column', null, 'row']}>
          <RoundedImage
            src={nft?.image.thumbnail}
            alt={nft?.name}
            width={64}
            height={64}
            mr={[0, null, '16px']}
            mb={['8px', null, 0]}
          />
          <Flex flexDirection="column">
            <Text textAlign={['center', null, 'left']} color="textSubtle" fontSize="14px">
              {nft?.collectionName}
            </Text>
            <Text textAlign={['center', null, 'left']} bold>
              {nft?.name}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Flex alignItems="center" justifyContent="flex-end">
          <ActivityEventText marketEvent={activity.marketEvent} />
        </Flex>
        {isXs || isSm ? <ActivityPrice price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} /> : null}
      </Td>
      {isXs || isSm ? null : (
        <>
          <Td>
            <ActivityPrice price={priceAsFloat} bnbBusdPrice={bnbBusdPrice} />
          </Td>
          <Td>
            <Flex justifyContent="flex-end">
              <Text>{activity.otherParty ? truncateHash(activity.otherParty) : '-'}</Text>
            </Flex>
          </Td>
        </>
      )}
      <Td>
        <Flex justifyContent="center">
          <Text textAlign="center" fontSize={isXs || isSm ? '12px' : '16px'}>
            {localeTimestamp}
          </Text>
        </Flex>
      </Td>
      {isXs || isSm ? null : (
        <Td>
          <IconButton as={Link} external href={getBscScanLink(activity.tx, 'transaction', chainId)}>
            <OpenNewIcon color="textSubtle" width="18px" />
          </IconButton>
        </Td>
      )}
    </tr>
  )
}

export default ActivityRow
