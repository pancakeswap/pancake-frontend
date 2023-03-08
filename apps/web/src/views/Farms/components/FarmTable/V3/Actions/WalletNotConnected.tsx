import { useTranslation } from '@pancakeswap/localization'
import { Text, Farm as FarmUI } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import BoostedAction from '../../../YieldBooster/components/BoostedAction'
import { ActionContent, ActionTitles } from './styles'

interface WalletNotConnectedProps {
  account: string
  farm: FarmWithStakedValue
  hasNoPosition: boolean
  liquidityUrlPathParts: string
}

const { NoPosition } = FarmUI.FarmV3Table

const WalletNotConnected: React.FunctionComponent<React.PropsWithChildren<WalletNotConnectedProps>> = ({
  farm,
  account,
  hasNoPosition,
  liquidityUrlPathParts,
}) => {
  const { t } = useTranslation()
  const { stakedBalance, tokenBalance, proxy } = farm.userData

  return (
    <NoPosition
      account={account}
      hasNoPosition={hasNoPosition}
      liquidityUrlPathParts={liquidityUrlPathParts}
      connectWalletButton={<ConnectWalletButton width="100%" />}
      boostedAction={
        farm.boosted && (
          <BoostedAction
            title={(status) => (
              <ActionTitles>
                <Text mr="3px" bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {t('Yield Booster')}
                </Text>
                <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
                  {status}
                </Text>
              </ActionTitles>
            )}
            desc={(actionBtn) => <ActionContent>{actionBtn}</ActionContent>}
            farmPid={farm?.pid}
            lpTokenStakedAmount={farm?.lpTokenStakedAmount}
            userBalanceInFarm={
              stakedBalance.plus(tokenBalance).gt(0)
                ? stakedBalance.plus(tokenBalance)
                : proxy.stakedBalance.plus(proxy.tokenBalance)
            }
          />
        )
      }
    />
  )
}

export default WalletNotConnected
