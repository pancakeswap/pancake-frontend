import { Flex } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { TokenPairImage } from 'components/TokenImage'
import { Address } from 'viem'

const { FarmTokenInfo } = FarmWidget.FarmTable

export const FarmCell: React.FunctionComponent<
  React.PropsWithChildren<FarmWidget.FarmTableFarmTokenInfoProps & { chainId?: number; lpAddress?: Address }>
> = ({ token, quoteToken, label, pid, isReady, isStaking, merklLink, hasBothFarmAndMerkl, merklApr }) => {
  return (
    <Flex alignItems="center">
      <FarmTokenInfo
        pid={pid}
        label={label}
        token={token}
        quoteToken={quoteToken}
        isReady={isReady}
        isStaking={isStaking}
        merklLink={merklLink}
        hasBothFarmAndMerkl={hasBothFarmAndMerkl}
        merklApr={merklApr}
      >
        <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
      </FarmTokenInfo>
    </Flex>
  )
}
