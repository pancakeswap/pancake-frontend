import { Dispatch, SetStateAction, useState } from 'react'
import { Flex, FlexGap, Row, Text } from '@pancakeswap/uikit'
import { CryptoFormView, ProviderQuote } from 'views/BuyCrypto/types'
import { useTranslation } from '@pancakeswap/localization'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'
import AccordionItem from './AccordionItem'

function Accordion({
  combinedQuotes,
  fetching,
  setModalView,
}: {
  combinedQuotes: ProviderQuote[]
  fetching: boolean
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}) {
  const { t } = useTranslation()
  const [currentIdx, setCurrentIdx] = useState<number | string>(0)

  combinedQuotes.sort((a: ProviderQuote, b: ProviderQuote) => {
    if (a.provider === ONRAMP_PROVIDERS.Mercuryo && b.provider !== ONRAMP_PROVIDERS.Mercuryo) return -1
    if (a.provider !== ONRAMP_PROVIDERS.Mercuryo && b.provider === ONRAMP_PROVIDERS.Mercuryo) return 1
    return 0
  })

  if (combinedQuotes.length === 0) {
    return (
      <FlexGap flexDirection="column" gap="16px">
        <Row paddingBottom="20px" justifyContent="center">
          <Flex>
            <Text ml="4px" fontSize="16px" textAlign="center">
              {t('No quote for this token pair at the moment.')}
            </Text>
          </Flex>
        </Row>
      </FlexGap>
    )
  }
  return (
    <FlexGap flexDirection="column" gap="16px">
      {combinedQuotes.map((quote: ProviderQuote, idx) => {
        return (
          <AccordionItem
            key={quote.provider}
            active={currentIdx === idx}
            btnOnClick={() => setCurrentIdx((a) => (a === idx ? '' : idx))}
            quote={quote}
            fetching={fetching}
            setModalView={setModalView}
          />
        )
      })}
    </FlexGap>
  )
}

export default Accordion
