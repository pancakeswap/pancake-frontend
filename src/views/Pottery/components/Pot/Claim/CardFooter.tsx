import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
`

const CardFooter: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('weighted')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('avg multiplier')}
          </Text>
        </Box>
        <Text bold>X12</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
            {t('Deposit')}
          </Text>
          <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('by cohort')}
          </Text>
        </Box>
        <Box>
          <Text bold as="span">
            1,234,567.89
          </Text>
          <Text ml="4px" color="textSubtle" textTransform="uppercase" as="span">
            {t('CAKE')}
          </Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
            {t('remaining')}
          </Text>
          <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('period')}
          </Text>
        </Box>
        <Box>
          <Text bold as="span">
            23
          </Text>
          <Text ml="4px" color="textSubtle" textTransform="uppercase" as="span">
            {t('Days')}
          </Text>
        </Box>
      </Flex>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('total #')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('winnings')}
          </Text>
        </Box>
        <Text bold>12</Text>
      </Flex>
    </Container>
  )
}

export default CardFooter
