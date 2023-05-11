import styled from 'styled-components'
import { Text, Flex, Skeleton, Farm as FarmUI, Tag } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { Token } from '@pancakeswap/swap-sdk-core'

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

const { V3FeeTag } = FarmUI.Tags

interface PairInfoProps {
  isReady: boolean
  lpSymbol: string
  token: Token
  quoteToken: Token
  feeAmount: number
}

const PairInfo: React.FunctionComponent<React.PropsWithChildren<PairInfoProps>> = ({
  isReady,
  lpSymbol,
  token,
  quoteToken,
  feeAmount,
}) => {
  if (!isReady) {
    return (
      <Flex alignItems="center">
        <Skeleton mr="8px" width={32} height={32} variant="circle" />
        <div>
          <Skeleton width={40} height={10} mb="4px" />
          <Skeleton width={60} height={24} />
        </div>
      </Flex>
    )
  }

  return (
    <Flex alignItems="center">
      <Flex
        flexDirection={['column', 'column', 'column', 'column', 'row']}
        alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}
      >
        {token && quoteToken && (
          <TokenWrapper>
            <TokenPairImage
              width={40}
              height={40}
              variant="inverted"
              primaryToken={token}
              secondaryToken={quoteToken}
            />
          </TokenWrapper>
        )}
        <Flex flexDirection={['column', 'column', 'row']} mt={['4px', '4px', '4px', '4px', '0']}>
          <Text style={{ alignSelf: 'center' }} lineHeight="110%" bold>
            {lpSymbol}
          </Text>
          <Flex m={['4px 0 0 0', '4px 0 0 0', '0 0 0 4px']}>
            <V3FeeTag style={{ alignSelf: 'flex-start' }} feeAmount={feeAmount} scale="sm" />
            <Tag style={{ alignSelf: 'flex-start' }} ml="4px" variant="secondary" scale="sm">
              V3
            </Tag>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PairInfo
