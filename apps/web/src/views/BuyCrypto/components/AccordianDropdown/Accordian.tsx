import { useState } from 'react'
// import { AccordionData } from "../types";
import { Flex, FlexGap, Row, Text } from '@pancakeswap/uikit'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'
import { useTranslation } from '@pancakeswap/localization'
import AccordionItem from './AccordianItem'

function Accordion({
  buyCryptoState,
  combinedQuotes,
  fetching,
}: {
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
  fetching: boolean
}) {
  const { t } = useTranslation()
  const [currentIdx, setCurrentIdx] = useState<number | string>(0)

  if (combinedQuotes.length === 0) {
    return (
      <FlexGap flexDirection="column" gap="16px">
        <Row paddingBottom="20px">
          <Flex>
            <Text ml="4px" fontSize="16px" textAlign="center">
              {t('No quotes are availble for the given input parameters.')}
            </Text>
          </Flex>
        </Row>
      </FlexGap>
    )
  }
  return (
    <FlexGap flexDirection="column" gap="16px">
      {combinedQuotes.map((quote: ProviderQoute, idx) => {
        return (
          <AccordionItem
            key={quote.provider}
            active={currentIdx === idx}
            btnOnClick={() => setCurrentIdx((a) => (a === idx ? '' : idx))}
            buyCryptoState={buyCryptoState}
            quote={quote}
            fetching={fetching}
          />
        )
      })}
    </FlexGap>
  )
}

export default Accordion
