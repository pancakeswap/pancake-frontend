import { createPortal } from 'react-dom'
import { PageMeta } from 'components/Layout/Page'
import { Box } from '@pancakeswap/uikit'
import Banner from 'views/SyrupPot/components/Banner/index'
import Pot from 'views/SyrupPot/components/Pot/index'
import FinishedRounds from './components/FinishedRounds'
import ScrollToTopButton from './components/ScrollToTopButton'
import HowToPlay from './components/HowToPlay'
import PrizeFunds from './components/PrizeFunds'
import FAQ from './components/FAQ'

const SyrupPot: React.FC = () => {
  return (
    <Box position="relative">
      <PageMeta />
      <Banner />
      <Pot />
      <FinishedRounds />
      <HowToPlay />
      <PrizeFunds />
      <FAQ />
      {createPortal(<ScrollToTopButton />, document.body)}
    </Box>
  )
}

export default SyrupPot
