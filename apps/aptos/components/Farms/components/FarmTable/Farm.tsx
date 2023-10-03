import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import { useFarmUserInfoCache } from 'state/farms/hook'

const { FarmTokenInfo } = FarmWidget.FarmTable

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmWidget.FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  label,
  pid,
  isReady,
}) => {
  const { data: userInfo } = useFarmUserInfoCache(String(pid))
  const stakedBalance = userInfo?.amount ? new BigNumber(userInfo.amount) : BIG_ZERO

  return (
    <FarmTokenInfo
      pid={pid}
      label={label}
      token={token}
      quoteToken={quoteToken}
      isReady={isReady}
      isStaking={stakedBalance.gt(0)}
    >
      <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
    </FarmTokenInfo>
  )
}

export default Farm
