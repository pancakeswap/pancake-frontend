import { useFarmUser } from 'state/farms/hooks'
import { Farm as FarmUI, FarmTableFarmTokenInfoProps } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'

const { FarmTokenInfo } = FarmUI.FarmTable

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  label,
  pid,
  isReady,
  isStable,
}) => {
  const { stakedBalance, tokenBalance, proxy } = useFarmUser(pid)

  return (
    <FarmTokenInfo
      pid={pid}
      label={label}
      token={token}
      quoteToken={quoteToken}
      isReady={isReady}
      isStable={isStable}
      stakedBalance={stakedBalance.plus(tokenBalance).gt(0) ? stakedBalance : proxy?.stakedBalance}
    >
      <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
    </FarmTokenInfo>
  )
}

export default Farm
