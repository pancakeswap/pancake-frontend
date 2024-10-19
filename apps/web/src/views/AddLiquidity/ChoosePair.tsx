import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { AddIcon, Box, CardBody, CardFooter, FlexGap, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { CurrencySelect } from 'components/CurrencySelect'
import { RowBetween } from 'components/Layout/Row'
import { useV2Pair } from 'hooks/usePairs'
import { useLPApr } from 'state/swap/useLPApr'
import { formatAmount } from 'utils/formatInfoNumbers'
import { useAccount } from 'wagmi'
import { AppHeader } from '../../components/App'
import { CommonBasesType } from '../../components/SearchModal/types'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'

export function ChoosePair({
  currencyA,
  currencyB,
  error,
  onNext,
}: {
  currencyA?: Currency
  currencyB?: Currency
  error?: string
  onNext?: () => void
}) {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()
  const [, pair] = useV2Pair(currencyA, currencyB)
  const poolData = useLPApr('v2', pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 24 hours' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  return (
    <>
      <AppHeader
        title={t('Add Liquidity')}
        subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
        helper={t(
          'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pair.',
        )}
        backTo="/liquidity/pools"
      />
      <CardBody>
        <Box>
          <Text textTransform="uppercase" color="secondary" bold small pb="24px">
            {t('Choose a valid pair')}
          </Text>
          <FlexGap gap="4px">
            <CurrencySelect
              id="add-liquidity-select-tokena"
              selectedCurrency={currencyA}
              onCurrencySelect={handleCurrencyASelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
            <AddIcon color="textSubtle" />
            <CurrencySelect
              id="add-liquidity-select-tokenb"
              selectedCurrency={currencyB}
              onCurrencySelect={handleCurrencyBSelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
          </FlexGap>
          {pair && poolData && (
            <RowBetween mt="24px">
              <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
                {t('LP reward APR')}
              </TooltipText>
              {tooltipVisible && tooltip}
              <Text bold color="primary">
                {formatAmount(poolData.lpApr)}%
              </Text>
            </RowBetween>
          )}
        </Box>
      </CardBody>
      <CardFooter>
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <CommitButton
            data-test="choose-pair-next"
            width="100%"
            variant={!isValid ? 'danger' : 'primary'}
            onClick={onNext}
            disabled={!isValid}
          >
            {error ?? t('Add Liquidity')}
          </CommitButton>
        )}
      </CardFooter>
    </>
  )
}
