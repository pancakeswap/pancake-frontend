import { Box } from '@pancakeswap/uikit'
import { Banner } from 'views/Game/components/Developers/Banner'
import { Infrastructure } from 'views/Game/components/Developers/Infrastructure'
import { Footer } from 'views/Game/components/Developers/Footer'

export const GameDevelopers = () => {
  return (
    <Box>
      <Banner />
      <Infrastructure />
      <Footer />
    </Box>
  )
}
