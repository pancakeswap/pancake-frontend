import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Flex,
  Text,
  Button,
  Modal,
  ModalV2,
  LinkExternal,
  CalculateIcon,
  IconButton,
  Skeleton,
  AutoRenewIcon,
  Message,
  MessageText,
  ErrorIcon,
} from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import _toNumber from 'lodash/toNumber'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import BCakeCalculator from 'views/Farms/components/YieldBooster/components/BCakeCalculator'
import { useTranslation } from '@pancakeswap/localization'
import { getFullDisplayBalance, formatNumber } from 'utils/formatBalance'
import { getInterestBreakdown } from 'utils/compoundApyHelpers'

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`

interface DepositModalProps {
  pid: number
  max: BigNumber
  stakedBalance: BigNumber
  multiplier?: string
  lpPrice: BigNumber
  lpLabel?: string
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  apr?: number
  displayApr?: string
  addLiquidityUrl?: string
  cakePrice?: BigNumber
  showActiveBooster?: boolean
  lpTotalSupply: BigNumber
}

const DepositModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  max,
  stakedBalance,
  onConfirm,
  onDismiss,
  tokenName = '',
  multiplier,
  displayApr,
  lpPrice,
  lpLabel = '',
  apr,
  addLiquidityUrl,
  cakePrice,
  showActiveBooster,
  lpTotalSupply,
}) => {
  const [val, setVal] = useState('')
  const [bCakeMultiplier, setBCakeMultiplier] = useState<number | null>(() => null)
  const [pendingTx, setPendingTx] = useState(false)
  const [showRoiCalculator, setShowRoiCalculator] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const lpTokensToStake = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const usdToStake = lpTokensToStake.times(lpPrice)

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !lpTokensToStake.isNaN() ? usdToStake.toNumber() : 0,
    apr,
    earningTokenPrice: cakePrice.toNumber(),
  })

  const annualRoi = cakePrice.times(interestBreakdown[3])
  const annualRoiAsNumber = annualRoi.toNumber()
  const formattedAnnualRoi = formatNumber(annualRoiAsNumber, annualRoi.gt(10000) ? 0 : 2, annualRoi.gt(10000) ? 0 : 2)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  if (showRoiCalculator) {
    return (
      <ModalV2 isOpen={showRoiCalculator}>
        <RoiCalculatorModal
          linkLabel={t('Get %symbol%', { symbol: lpLabel })}
          stakingTokenBalance={stakedBalance.plus(max)}
          stakingTokenSymbol={tokenName}
          stakingTokenPrice={lpPrice.toNumber()}
          earningTokenPrice={cakePrice.toNumber()}
          apr={bCakeMultiplier ? apr * bCakeMultiplier : apr}
          multiplier={multiplier}
          displayApr={bCakeMultiplier ? (_toNumber(displayApr) - apr + apr * bCakeMultiplier).toFixed(2) : displayApr}
          linkHref={addLiquidityUrl}
          isFarm
          initialValue={val}
          onBack={() => setShowRoiCalculator(false)}
          bCakeCalculatorSlot={(calculatorBalance) => (
            <BCakeCalculator
              targetInputBalance={calculatorBalance}
              earningTokenPrice={cakePrice.toNumber()}
              lpTotalSupply={lpTotalSupply}
              setBCakeMultiplier={setBCakeMultiplier}
            />
          )}
        />
      </ModalV2>
    )
  }

  return (
    <Modal title={t('Stake LP tokens')} onDismiss={onDismiss}>
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t('Stake')}
      />
      {showActiveBooster ? (
        <Message variant="warning" icon={<ErrorIcon width="24px" color="warning" />} mt="32px">
          <MessageText>
            {t('The yield booster multiplier will be updated based on the latest staking conditions.')}
          </MessageText>
        </Message>
      ) : null}
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        <Text mr="8px" color="textSubtle">
          {t('Annual ROI at current rates')}:
        </Text>
        {Number.isFinite(annualRoiAsNumber) ? (
          <AnnualRoiContainer
            alignItems="center"
            onClick={() => {
              setShowRoiCalculator(true)
            }}
          >
            <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
            <IconButton variant="text" scale="sm">
              <CalculateIcon color="textSubtle" width="18px" />
            </IconButton>
          </AnnualRoiContainer>
        ) : (
          <Skeleton width={60} />
        )}
      </Flex>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        {pendingTx ? (
          <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
            {t('Confirming')}
          </Button>
        ) : (
          <Button
            width="100%"
            disabled={!lpTokensToStake.isFinite() || lpTokensToStake.eq(0) || lpTokensToStake.gt(fullBalanceNumber)}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              onDismiss?.()
              setPendingTx(false)
            }}
          >
            {t('Confirm')}
          </Button>
        )}
      </ModalActions>
      <LinkExternal href={addLiquidityUrl} style={{ alignSelf: 'center' }}>
        {t('Get %symbol%', { symbol: tokenName })}
      </LinkExternal>
    </Modal>
  )
}

export default DepositModal
