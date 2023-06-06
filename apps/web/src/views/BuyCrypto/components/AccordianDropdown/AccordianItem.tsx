import { Button, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { CryptoCard } from 'components/Card'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useEffect, useRef, useState } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { getRefValue } from 'views/BuyCrypto/hooks/useGetRefValue'
import { ProviderQoute } from 'views/BuyCrypto/hooks/usePriceQuoter'
import styled from 'styled-components'
import MoonPayLogo from '../../../../../public/images/onRampProviders/moonpaySvg.svg'
import BinanceConnectLogo from '../../../../../public/images/onRampProviders/binanceConnectSvg.svg'

const ProviderToLogo: { [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  MoonPay: MoonPayLogo,
  BinanceConnect: BinanceConnectLogo,
}

interface Props {
  provider: string
}

const UnknownEntry = styled.div`
  height: 24px;
  width: 24px;
  background: #dee0e3;
  border-radius: 50%;
`

export const ProviderIcon: React.FC<
  Props &
    (React.SVGProps<SVGSVGElement> &
      React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>)
> = ({ provider, className, ...props }) => {
  const Icon = ProviderToLogo[provider]
  return <>{Icon ? <Icon className={className} {...props} /> : <UnknownEntry />}</>
}

function AccordionItem({
  active,
  btnOnClick,
  buyCryptoState,
  quote,
}: {
  active: boolean
  btnOnClick: any
  buyCryptoState: BuyCryptoState
  quote: ProviderQoute
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(105)
  const multiple = false
  const [visiblity, setVisiblity] = useState(false)

  // console.log(combinedQuotes.map(()))
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
        isClicked={active}
      >
        <RowBetween>
          <ProviderIcon provider={quote.provider} width="130px" />
          <Flex>
            <Text ml="4px" fontSize="22px" color="secondary">
              {quote.amount.toFixed(4)} ETH
            </Text>
          </Flex>
        </RowBetween>
        <RowBetween pt="8px">
          <Text fontSize="15px">ETH</Text>
          <Text ml="4px" fontSize="16px">
            = {quote.quote.toFixed(4)}
          </Text>
        </RowBetween>

        <div ref={contentRef} className="accordion-item-content" style={{ height }}>
          <RowBetween>
            <Text fontSize="14px" color="textSubtle">
              Total Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {quote.totalFee}
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize="14px" pl="8px" color="textSubtle">
              Networking Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {quote.networkFee}
            </Text>
          </RowBetween>
          <RowBetween>
            <Text fontSize="14px" pl="8px" color="textSubtle">
              Processing Fees
            </Text>
            <Text ml="4px" fontSize="14px" color="textSubtle">
              {quote.providerFee}
            </Text>
          </RowBetween>
          <FiatOnRampModalButton provider={quote.provider} />
        </div>
      </CryptoCard>
    </Flex>
  )
}

export default AccordionItem
