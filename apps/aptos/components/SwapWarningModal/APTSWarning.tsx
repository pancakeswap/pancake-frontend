import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'

export const APTSWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>
        {t(
          'Inscriptions are a recent and novel development in blockchain, and $APTS uses a lock-and-burn mechanism to convert non-fungible, and non-tradable Aptos Inscriptions into fungible and tradable representations. As with most smart contracts, this come with certain risks. Please do your own research.',
        )}
      </Text>
    </Box>
  )
}
