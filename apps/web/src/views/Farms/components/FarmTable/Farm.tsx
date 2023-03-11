import { Farm as FarmUI, FarmTableFarmTokenInfoProps } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'

const { FarmTokenInfo } = FarmUI.FarmTable

export const FarmCell: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  label,
  pid,
  isReady,
  isStaking,
}) => {
  return (
    <FarmTokenInfo
      pid={pid}
      label={label}
      token={token}
      quoteToken={quoteToken}
      isReady={isReady}
      isStaking={isStaking}
    >
      <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
    </FarmTokenInfo>
  )
}
