import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { Footer } from 'views/Game/components/Developers/Footer'

export const GameDevelopers = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Footer />
    </Box>
  )
}
