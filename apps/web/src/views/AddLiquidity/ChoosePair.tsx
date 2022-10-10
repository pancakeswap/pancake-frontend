import { Currency } from '@pancakeswap/sdk'
import { Box, Text, AddIcon, CardBody, CardFooter, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { CurrencySelect } from 'components/CurrencySelect'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { useLPApr } from 'state/swap/hooks'
import { RowBetween } from 'components/Layout/Row'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePair } from 'hooks/usePairs'
import { formatAmount } from 'utils/formatInfoNumbers'
import { AppHeader } from '../../components/App'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import { CommonBasesType } from '../../components/SearchModal/types'

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
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()
  const [, pair] = usePair(currencyA, currencyB)
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
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
          'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.',
        )}
        backTo="/liquidity"
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
                {formatAmount(poolData.lpApr7d)}%
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
