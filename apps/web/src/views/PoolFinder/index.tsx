import { Currency } from '@pancakeswap/sdk'
import { AddIcon, Button, ChevronDownIcon, Text, useModal, AutoColumn, ColumnCenter } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useCallback, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { LightCard } from 'components/Card'
import { MinimalPositionCard } from 'components/PositionCard'
import { PairState, useV2Pair } from 'hooks/usePairs'
import { usePairAdder } from 'state/user/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { currencyId } from 'utils/currencyId'
import { CommonBasesType } from 'components/SearchModal/types'
import Page from '../Page'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { CurrencyLogo } from '../../components/Logo'
import Dots from '../../components/Loader/Dots'
import Row from '../../components/Layout/Row'
import { AppBody, AppHeader } from '../../components/App'

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 16px;
`

export default function PoolFinder() {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const native = useNativeCurrency()

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1)
  const [currency0, setCurrency0] = useState<Currency | null>(native)
  const [currency1, setCurrency1] = useState<Currency | null>(null)

  const [pairState, pair] = useV2Pair(currency0 ?? undefined, currency1 ?? undefined)
  const addPair = usePairAdder()
  useEffect(() => {
    if (pair) {
      addPair(pair)
    }
  }, [pair, addPair])

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        pair.reserve0.quotient === BIG_INT_ZERO &&
        pair.reserve1.quotient === BIG_INT_ZERO,
    )

  const position = useTokenBalance(account ?? undefined, pair?.liquidityToken)
  const hasPosition = Boolean(position && position.quotient > BIG_INT_ZERO)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency)
      } else {
        setCurrency1(currency)
      }
    },
    [activeField],
  )

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? t('Connect to a wallet to find pools') : t('Select a token to find your liquidity.')}
      </Text>
    </LightCard>
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      commonBasesType={CommonBasesType.LIQUIDITY}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Import Pool')} subtitle={t('Import an existing pool')} backTo="/liquidity" />
        <AutoColumn style={{ padding: '1rem' }} gap="md">
          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN0)
            }}
          >
            {currency0 ? (
              <Row>
                <CurrencyLogo currency={currency0} />
                <Text ml="8px">{currency0.symbol}</Text>
              </Row>
            ) : (
              <Text ml="8px">{t('Select a Token')}</Text>
            )}
          </StyledButton>

          <ColumnCenter>
            <AddIcon />
          </ColumnCenter>

          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
              setActiveField(Fields.TOKEN1)
            }}
          >
            {currency1 ? (
              <Row>
                <CurrencyLogo currency={currency1} />
                <Text ml="8px">{currency1.symbol}</Text>
              </Row>
            ) : (
              <Text as={Row}>{t('Select a Token')}</Text>
            )}
          </StyledButton>

          {currency0 && currency1 ? (
            pairState === PairState.EXISTS ? (
              hasPosition && pair ? (
                <>
                  <MinimalPositionCard pair={pair} />
                  <Button
                    as={NextLinkFromReactRouter}
                    to={`/v2/pair/${pair.token0.address}/${pair.token1.address}`}
                    variant="secondary"
                    width="100%"
                  >
                    {t('Manage this pair')}
                  </Button>
                </>
              ) : (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text textAlign="center">{t('You don’t have liquidity in this pair yet.')}</Text>
                    <Button
                      as={NextLinkFromReactRouter}
                      to={`/v2/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                      variant="secondary"
                    >
                      {t('Add Liquidity')}
                    </Button>
                  </AutoColumn>
                </LightCard>
              )
            ) : validPairNoLiquidity ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">{t('No pair found.')}</Text>
                  <Button
                    as={NextLinkFromReactRouter}
                    to={`/v2/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    variant="secondary"
                  >
                    {t('Create pair')}
                  </Button>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.INVALID ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center" fontWeight={500}>
                    {t('Invalid pair.')}
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : pairState === PairState.LOADING ? (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">
                    {t('Loading')}
                    <Dots />
                  </Text>
                </AutoColumn>
              </LightCard>
            ) : null
          ) : (
            prerequisiteMessage
          )}
        </AutoColumn>
      </AppBody>
    </Page>
  )
}
