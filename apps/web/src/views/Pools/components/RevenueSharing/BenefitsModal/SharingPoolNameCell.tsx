import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, LogoRoundIcon, Box, Balance } from '@pancakeswap/uikit'

const SharingPoolNameCell = () => {
  const { t } = useTranslation()
  return (
    <Flex mb="16px">
      <LogoRoundIcon mr="8px" width={43} height={43} style={{ minWidth: 43 }} />
      <Box>
        <Text fontSize={12} color="secondary" bold lineHeight="110%" textTransform="uppercase">
          {t('CAKE locked')}
        </Text>
        <Balance fontSize={20} bold value={123} decimals={2} lineHeight="110%" />
        <Balance
          fontSize={12}
          fontWeight={400}
          prefix="~ "
          color="textSubtle"
          bold
          value={123}
          decimals={2}
          lineHeight="110%"
        />
      </Box>
    </Flex>
  )
}

export default SharingPoolNameCell
