import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Box, Message, MessageText, Text, Link } from '@pancakeswap/uikit'
import { usePotteryFetch } from 'state/pottery/hook'
import Banner from 'views/Pottery/components/Banner/index'
import Pot from 'views/Pottery/components/Pot/index'
import { useTranslation } from '@pancakeswap/localization'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import FinishedRounds from './components/FinishedRounds'
import HowToPlay from './components/HowToPlay'
import PrizeFunds from './components/PrizeFunds'
import FAQ from './components/FAQ'

const Pottery: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  usePotteryFetch()
  const potWrapperEl = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    window.scrollTo({
      top: potWrapperEl?.current?.offsetTop,
      behavior: 'smooth',
    })
  }, [])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Box position="relative">
      <Box padding="0 16px" margin="10px auto" width={['100%', '100%', '100%', '800px']}>
        <Message variant="warning">
          <MessageText>
            <Text as="span">{t('Pancakeswap Pottery (BETA) is indefinitely halted. Please refer')}</Text>
            <Link
              style={{ display: 'inline-block' }}
              m="0 4px"
              external
              href="https://blog.pancakeswap.finance/articles/idefinitely-halt-of-pancake-swap-pottery-beta-product"
            >
              {t('here')}
            </Link>
            <Text as="span">{t('for more details')}</Text>
          </MessageText>
        </Message>
      </Box>
      <Banner handleScroll={handleScroll} />
      <Box ref={potWrapperEl}>
        <Pot />
      </Box>
      <FinishedRounds />
      <HowToPlay />
      <PrizeFunds />
      <FAQ />
      {isClient &&
        createPortal(
          <>
            <SubgraphHealthIndicator subgraphName="pancakeswap/pottery" />
          </>,
          document.body,
        )}
    </Box>
  )
}

export default Pottery
