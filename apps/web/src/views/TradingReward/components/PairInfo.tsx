import styled from 'styled-components'
import { Text, Flex, Skeleton } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { Token } from '@pancakeswap/swap-sdk-core'

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

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
        <Flex mt={['4px', '4px', '4px', '4px', '0']}>
          <Text lineHeight="110%" bold>{`${lpSymbol} - ${feeAmount / 10000}%`}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PairInfo
