import { Box } from '@pancakeswap/uikit'
import { Banner } from 'components/Game/Developers/Banner'
import { Infrastructure } from 'components/Game/Developers/Infrastructure'
import { Footer } from 'components/Game/Developers/Footer'

export const GameDevelopers = () => {
  return (
    <Box overflowX="hidden">
      <Banner />
      <Infrastructure />
      <Footer />
    </Box>
  )
}
