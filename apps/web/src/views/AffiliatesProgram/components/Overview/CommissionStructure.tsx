import { Flex, Text, Box, Image } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const CommissionStructure = () => {
  const { t } = useTranslation()

  return (
    <Box mt={['92px']}>
      <Flex flexDirection="column" alignItems={['center']}>
        <Text fontSize={['20px']} mb={['16px']} bold color="secondary">
          {t('Commission structure')}
        </Text>
        <Text color="textSubtle" mb={['48px']}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </Text>
      </Flex>
      <Flex justifyContent={['center']}>
        <Box width={['200px']}>
          <Image m="auto auto 20px auto" width={128} height={148} src="/images/affiliates-program/stableSwap.png" />
          <Flex flexDirection="column" alignItems={['center']} borderRight={['0', 'solid 1px #D7CAEC']}>
            <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
              V2/V3 Swap & StableSwap
            </Text>
            <Text fontSize={['32px']} bold>
              3%
            </Text>
          </Flex>
        </Box>
        <Box width={['200px']}>
          <Image m="auto auto 20px auto" width={100} height={148} src="/images/affiliates-program/perpetual.png" />
          <Flex flexDirection="column" alignItems={['center']}>
            <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
              Perpetual
            </Text>
            <Text fontSize={['32px']} bold>
              20%
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default CommissionStructure
