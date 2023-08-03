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

const { V3Tag, V3FeeTag, EthTag, BscTag, ZkEVMTag, ZkSyncTag } = FarmUI.Tags

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
      <Flex width="100%">
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
        <Flex width="100%">
          <Flex alignSelf="center" width={['115px']}>
            <Text lineHeight="110%" bold>
              {lpSymbol}
            </Text>
          </Flex>
          <Flex ml={['auto', 'auto', 'auto', 'auto', '4px']}>
            <Flex>
              <V3FeeTag feeAmount={feeAmount} scale="sm" />
              <V3Tag ml="4px" scale="sm" />
            </Flex>
            <Flex ml="4px">
              {chainId === ChainId.ETHEREUM && <EthTag />}
              {chainId === ChainId.BSC && <BscTag />}
              {chainId === ChainId.POLYGON_ZKEVM && <ZkEVMTag />}
              {chainId === ChainId.ZKSYNC && <ZkSyncTag />}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PairInfo
