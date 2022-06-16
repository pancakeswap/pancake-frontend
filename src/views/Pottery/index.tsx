import { createPortal } from 'react-dom'
import { PageMeta } from 'components/Layout/Page'
import { Box } from '@pancakeswap/uikit'
import { usePotteryFetch, usePottery } from 'state/pottery/hook'
import Banner from 'views/Pottery/components/Banner/index'
import Pot from 'views/Pottery/components/Pot/index'
import FinishedRounds from './components/FinishedRounds'
import ScrollToTopButton from './components/ScrollToTopButton'
import HowToPlay from './components/HowToPlay'
import PrizeFunds from './components/PrizeFunds'
import FAQ from './components/FAQ'

const Pottery: React.FC = () => {
  usePotteryFetch()
  const { userData } = usePottery()

  return (
    <Box position="relative">
      <PageMeta />
      <Banner />
      <Pot userData={userData} />
      <FinishedRounds />
      <HowToPlay />
      <PrizeFunds />
      <FAQ />
      {createPortal(<ScrollToTopButton />, document.body)}
    </Box>
  )
}

export default Pottery
