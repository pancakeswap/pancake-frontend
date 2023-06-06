import { Button, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { CryptoCard } from 'components/Card'
import { useEffect, useRef, useState } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { getRefValue } from 'views/BuyCrypto/hooks/useGetRefValue'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'

function AccordionItem({
  active,
  btnOnClick,
  buyCryptoState,
  combinedQuotes,
}: {
  active: boolean
  btnOnClick: any
  buyCryptoState: BuyCryptoState
  combinedQuotes: ProviderQoute[]
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(105)
  const multiple = false
  const [visiblity, setVisiblity] = useState(false)

  console.log(combinedQuotes)
  const isActive = () => (multiple ? visiblity : active)

  const toogleVisiblity = () => {
    setVisiblity((v) => !v)
    btnOnClick()
  }

  useEffect(() => {
    if (active) {
      const contentEl = getRefValue(contentRef)
      setHeight(contentEl.scrollHeight + 90)
    } else {
      setHeight(105)
    }
  }, [active])

  return (
    <Flex flexDirection="column">
      <CryptoCard
        padding="12px 12px"
        style={{ height }}
        onClick={!isActive() ? toogleVisiblity : () => null}
        position="relative"
      >
        <RowBetween>
          <Text fontSize="18px">Binance</Text>
          <Flex>
            {/* <Box width={24} height={24}>
                  <Image src={`/images/tokens/${wbethContract?.address}.png`} width={24} height={24} alt="WBETH" />
                  <FiatIcon name="EUR"/>
                </Box> */}
            <Text ml="4px" fontSize="22px" color="secondary">
              0.93253 ETH
            </Text>
          </Flex>
        </RowBetween>
        <RowBetween pt="8px">
          <Text fontSize="15px">ETH</Text>
          <Text ml="4px" fontSize="16px">
            = 93.245
          </Text>
        </RowBetween>

        <div ref={contentRef} className="accordion-item-content" style={{ height }}>
          <RowBetween>
            <Text fontSize="14px" color="textSubtle">
              Total Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              0.0092
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize="14px" pl="8px" color="textSubtle">
              Networking Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              0.0092
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize="14px" pl="8px" color="textSubtle">
              Processing Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              0.0092
            </Text>
          </RowBetween>
          <Button width="100%" mb="8px" mt="16px">
            Buy With Moonpay
          </Button>
        </div>
      </CryptoCard>
    </Flex>
  )
}

export default AccordionItem
