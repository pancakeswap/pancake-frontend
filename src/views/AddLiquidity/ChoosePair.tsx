import { Currency } from '@pancakeswap/sdk'
import { Box, Text, AddIcon, CardBody, Button, CardFooter } from '@pancakeswap/uikit'
import { CurrencySelect } from 'components/CurrencySelect'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import currencyId from 'utils/currencyId'
import { AppHeader } from '../../components/App'

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
  const isValid = !error
  const router = useRouter()
  const [currencyIdA, currencyIdB] = router.query.currency || []

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        router.replace(`/add/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
      } else if (currencyIdB) {
        router.replace(`/add/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
      } else {
        router.replace(`/add/${newCurrencyIdA}`, undefined, { shallow: true })
      }
    },
    [currencyIdB, router, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.replace(`/add/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
        } else {
          router.replace(`/add/${newCurrencyIdB}`, undefined, { shallow: true })
        }
      } else {
        router.replace(`/add/${currencyIdA || 'BNB'}/${newCurrencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, router, currencyIdB],
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
            {t('Choose a Token Pair')}
          </Text>
          <FlexGap gap="4px">
            <CurrencySelect selectedCurrency={currencyA} onCurrencySelect={handleCurrencyASelect} showCommonBases />
            <AddIcon color="textSubtle" />
            <CurrencySelect selectedCurrency={currencyB} onCurrencySelect={handleCurrencyBSelect} showCommonBases />
          </FlexGap>
        </Box>
      </CardBody>
      <CardFooter>
        <Button width="100%" variant={!isValid ? 'danger' : 'primary'} onClick={onNext} disabled={!isValid}>
          {error ?? t('Add liquidity')}
        </Button>
      </CardFooter>
    </>
  )
}
