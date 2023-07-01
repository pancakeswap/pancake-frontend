import { Box, Flex, InfoIcon, RowBetween, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { CryptoCard } from 'components/Card'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getRefValue } from 'views/BuyCrypto/hooks/useGetRefValue'
import { ProviderQoute } from 'views/BuyCrypto/types'
import styled, { useTheme } from 'styled-components'
import { ProviderIcon } from 'views/BuyCrypto/Icons'
import { useTranslation } from '@pancakeswap/localization'
import { isMobile } from 'react-device-detect'
import Image from 'next/image'
import formatLocaleNumber from 'utils/formatLocaleNumber'

import { ONRAMP_PROVIDERS, providerFeeTypes } from 'views/BuyCrypto/constants'
import MercuryoAltSvg from '../../../../../public/images/onRampProviders/mercuryo_new_logo_black.png'
import MercuryoAltSvgLight from '../../../../../public/images/onRampProviders/mercuryo_new_logo_white.png'

const DropdownWrapper = styled.div<{ isClicked: boolean }>`
  padding-top: ${({ isClicked }) => (isClicked ? '20px' : '0px')};
  width: 100%;
`

const FeeItem = ({ feeTitle, feeAmount, currency }: { feeTitle: string; feeAmount: number; currency: string }) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  return (
    <RowBetween>
      <Text fontSize="14px" color="textSubtle">
        {feeTitle}
      </Text>
      <Text ml="4px" fontSize="14px" color="textSubtle">
        {formatLocaleNumber({ number: feeAmount, locale })} {currency}
      </Text>
    </RowBetween>
  )
}

function AccordionItem({
  active,
  btnOnClick,
  quote,
  fetching,
}: {
  active: boolean
  btnOnClick: any
  quote: ProviderQoute
  fetching: boolean
}) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const theme = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(105)
  const multiple = false
  const [visiblity, setVisiblity] = useState(false)
  const [mobileTooltipShow, setMobileTooltipShow] = useState(false)

  const isActive = () => (multiple ? visiblity : active)

  const toogleVisiblity = useCallback(() => {
    setVisiblity((v) => !v)
    btnOnClick()
  }, [setVisiblity, btnOnClick])

  useEffect(() => {
    if (active) {
      const contentEl = getRefValue(contentRef)
      setHeight(contentEl.scrollHeight + 100)
    } else setHeight(105)
  }, [active])

  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <Box maxWidth="150px">
      <Text as="p">
        {t('Price quote from provider is currently unavailable. Please try again or try a different amount')}
      </Text>
    </Box>,
    {
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: mobileTooltipShow }),
    },
  )

  if (quote.amount === 0) {
    return (
      <Flex flexDirection="column">
        <CryptoCard padding="16px 16px" style={{ height: '48px' }} position="relative" isClicked={false} isDisabled>
          <RowBetween paddingBottom="20px">
            {quote.provider === ONRAMP_PROVIDERS.Mercuryo ? (
              <Flex mt="5px">
                <Image src={theme.isDark ? MercuryoAltSvgLight : MercuryoAltSvg} alt="#" width={120} />
              </Flex>
            ) : (
              <ProviderIcon provider={quote.provider} width="130px" isDisabled={false} />
            )}
            <TooltipText
              ref={buyCryptoTargetRef}
              onClick={() => setMobileTooltipShow(false)}
              display="flex"
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Flex alignItems="center" justifyContent="center">
                <Text ml="4px" fontSize="14px" color="textSubtle">
                  Quote not available
                </Text>
                <InfoIcon color="textSubtle" pl="4px" pt="2px" />
              </Flex>
            </TooltipText>
            {buyCryptoTooltipVisible && (!isMobile || mobileTooltipShow) && buyCryptoTooltip}
          </RowBetween>
        </CryptoCard>
      </Flex>
    )
  }
  return (
    <Flex flexDirection="column">
      <CryptoCard
        padding="16px 16px"
        style={{ height }}
        onClick={!isActive() ? toogleVisiblity : () => null}
        position="relative"
        isClicked={active}
        isDisabled={false}
      >
        <RowBetween paddingBottom="8px">
          {quote.provider === ONRAMP_PROVIDERS.Mercuryo ? (
            <Flex mt="5px">
              <Image src={theme.isDark ? MercuryoAltSvgLight : MercuryoAltSvg} alt="#" width={120} />
            </Flex>
          ) : (
            <ProviderIcon provider={quote.provider} width="130px" isDisabled={false} />
          )}

          <Text ml="4px" fontSize="22px" color="#7A6EAA" fontWeight="bold">
            {formatLocaleNumber({ number: quote.quote, locale })} {quote.cryptoCurrency}
          </Text>
        </RowBetween>
        <RowBetween pt="12px">
          <Text fontSize="15px">
            {quote.cryptoCurrency} {t('rate')}
          </Text>
          <Text ml="4px" fontSize="16px">
            = {formatLocaleNumber({ number: quote.amount, locale })} {quote.fiatCurrency}
          </Text>
        </RowBetween>

        <DropdownWrapper ref={contentRef} isClicked={!isActive()}>
          {providerFeeTypes[quote.provider].map((feeType: string, index: number) => {
            let fee = 0
            if (index === 0) fee = quote.networkFee + quote.providerFee
            else if (index === 1) fee = quote.networkFee
            else fee = quote.providerFee
            return <FeeItem key={feeType} feeTitle={feeType} feeAmount={fee} currency={quote.fiatCurrency} />
          })}
          <FiatOnRampModalButton
            provider={quote.provider}
            inputCurrency={quote.cryptoCurrency}
            outputCurrency={quote.fiatCurrency}
            amount={quote.amount.toString()}
            disabled={fetching}
          />
        </DropdownWrapper>
      </CryptoCard>
    </Flex>
  )
}

export default AccordionItem
