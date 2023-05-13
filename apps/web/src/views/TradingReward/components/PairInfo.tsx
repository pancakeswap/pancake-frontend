import styled from 'styled-components'
import { Text, Flex, Skeleton, Farm as FarmUI } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { Token } from '@pancakeswap/swap-sdk-core'
import { ChainId } from '@pancakeswap/sdk'

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

const { V3Tag, V3FeeTag, EthTag, BscTag } = FarmUI.Tags

interface PairInfoProps {
  isReady: boolean
  lpSymbol: string
  token: Token
  quoteToken: Token
  feeAmount: number
  chainId: ChainId
}

const PairInfo: React.FunctionComponent<React.PropsWithChildren<PairInfoProps>> = ({
  isReady,
  lpSymbol,
  token,
  quoteToken,
  feeAmount,
  chainId,
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
          <Flex alignSelf={['flex-start', 'flex-start', 'center']}>
            <Text lineHeight="110%" bold>
              {lpSymbol}
            </Text>
          </Flex>
          <Flex flexDirection={['column', 'column', 'row']} m={['4px 0 0 0', '4px 0 0 0', '0 0 0 4px']}>
            <Flex>
              <V3FeeTag feeAmount={feeAmount} scale="sm" />
              <V3Tag ml="4px" scale="sm" />
            </Flex>
            <Flex ml={['0', '0', '4px']} mt={['4px', '4px', '0']}>
              {chainId === ChainId.ETHEREUM && <EthTag />}
              {chainId === ChainId.BSC && <BscTag />}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PairInfo
