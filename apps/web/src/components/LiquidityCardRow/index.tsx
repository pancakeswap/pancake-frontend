import { Text, Card, Flex, Tag, SyncAltIcon } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import styled from 'styled-components'

import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent, Currency } from '@pancakeswap/sdk'

const TagCell = styled(Flex)`
  padding: 8px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    position: absolute;
    right: 16px;
    top: 30%;
  }
`

interface LiquidityCardRowProps {
  link?: string
  currency0: Currency
  currency1: Currency
  pairText: string | React.ReactElement
  feeAmount?: number
  tokenId?: bigint
  tags: React.ReactElement
  subtitle: string
  onSwitch?: () => void
}

export const LiquidityCardRow = ({
  link,
  currency0,
  currency1,
  pairText,
  feeAmount,
  tags,
  subtitle,
  tokenId,
  onSwitch,
}: LiquidityCardRowProps) => {
  const content = (
    <Flex justifyContent="space-between" p="16px">
      <Flex flexDirection="column">
        <Flex alignItems="center" mb="4px" flexWrap="wrap">
          <Flex width={['100%', '100%', 'inherit']} pr="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text bold ml="8px">
              {pairText}
            </Text>
          </Flex>
          {typeof tokenId !== 'undefined' && <Text mr="8px">{`(#${tokenId.toString()})`}</Text>}
          {!!feeAmount && (
            <Tag variant="secondary" mr="8px" outline>
              {new Percent(feeAmount, 1_000_000).toSignificant()}%
            </Tag>
          )}
          <TagCell>{tags}</TagCell>
        </Flex>
        <Flex>
          <Text fontSize="14px" color="textSubtle">
            {subtitle}
          </Text>
          {onSwitch ? (
            <SyncAltIcon
              onClick={(e) => {
                e.preventDefault()
                onSwitch()
              }}
              ml="4px"
              color="primary"
            />
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  )

  if (link) {
    return (
      <Card mb="8px">
        <NextLink href={link}>{content}</NextLink>
      </Card>
    )
  }

  return <Card mb="8px">{content}</Card>
}
