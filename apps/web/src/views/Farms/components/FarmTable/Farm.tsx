import { useFarmUser } from 'state/farms/hooks'
import { Farm as FarmUI, FarmTableFarmTokenInfoProps, Flex } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { STGWarningTooltip } from 'components/STGWarningModal/STGWarningTooltip'
import { ethereumTokens } from '@pancakeswap/tokens'

const { FarmTokenInfo } = FarmUI.FarmTable

const Farm: React.FunctionComponent<React.PropsWithChildren<FarmTableFarmTokenInfoProps>> = ({
  token,
  quoteToken,
  label,
  pid,
  isReady,
  isStable,
  isBoosted,
}) => {
  const { stakedBalance, proxy } = useFarmUser(pid)

  return (
    <Flex alignItems="center">
      <FarmTokenInfo
        pid={pid}
        label={label}
        token={token}
        quoteToken={quoteToken}
        isReady={isReady}
        isStable={isStable}
        isBoosted={isBoosted}
        stakedBalance={proxy?.stakedBalance?.gt(0) ? proxy?.stakedBalance : stakedBalance}
      >
        <TokenPairImage width={40} height={40} variant="inverted" primaryToken={token} secondaryToken={quoteToken} />
      </FarmTokenInfo>
      {token.address === ethereumTokens.stg.address && <STGWarningTooltip />}
    </Flex>
  )
}

export default Farm
