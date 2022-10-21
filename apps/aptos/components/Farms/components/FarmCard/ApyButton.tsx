import { useTranslation } from '@pancakeswap/localization'
import {
  Text,
  TooltipText,
  // useModal,
  useTooltip,
  Farm as FarmUI,
  // RoiCalculatorModal
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import { useFarmFromPid, useFarmUser, useLpTokenPrice } from 'state/farms/hooks'

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
  lpLabel?: string
  multiplier: string
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  useTooltipText?: boolean
  hideButton?: boolean
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  // pid,
  // lpLabel,
  // lpSymbol,
  // cakePrice,
  apr = 0,
  // multiplier,
  displayApr,
  lpRewardsApr,
  // addLiquidityUrl = '',
  useTooltipText,
  hideButton,
}) => {
  const { t } = useTranslation()
  // const { account } = useActiveWeb3React()

  // const lpPrice = useLpTokenPrice(lpSymbol)
  // const { tokenBalance, stakedBalance } = useFarmUser(pid)

  // const userBalanceInFarm = stakedBalance.plus(tokenBalance)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('APR (incl. LP rewards)')}: <Text style={{ display: 'inline-block' }}>{`${displayApr}%`}</Text>
      </Text>
      <Text ml="5px">
        *{t('Base APR (CAKE yield only)')}: {`${apr.toFixed(2)}%`}
      </Text>
      <Text ml="5px">
        *{t('LP Rewards APR')}: {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
      </Text>
    </>,
    {
      placement: 'top',
    },
  )

  // const [onPresentApyModal] = useModal(
  //   <RoiCalculatorModal
  //     account={account?.address}
  //     pid={pid}
  //     linkLabel={t('Get %symbol%', { symbol: lpLabel })}
  //     stakingTokenBalance={userBalanceInFarm}
  //     stakingTokenSymbol={lpSymbol}
  //     stakingTokenPrice={lpPrice.toNumber()}
  //     earningTokenPrice={cakePrice.toNumber()}
  //     apr={apr}
  //     multiplier={multiplier}
  //     displayApr={displayApr}
  //     linkHref={addLiquidityUrl}
  //     isFarm
  //   />,
  //   false,
  //   true,
  //   `FarmModal${pid}`,
  // )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    // onPresentApyModal()
  }

  return (
    <FarmUI.FarmApyButton variant={variant} hideButton={hideButton} handleClickButton={handleClickButton}>
      {useTooltipText ? (
        <>
          <TooltipText ref={targetRef} decorationColor="secondary">
            {displayApr}%
          </TooltipText>
          {tooltipVisible && tooltip}
        </>
      ) : (
        <>{displayApr}%</>
      )}
    </FarmUI.FarmApyButton>
  )
}

export default ApyButton
