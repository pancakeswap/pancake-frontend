import { useTranslation } from '@pancakeswap/localization'
import { Message, MessageText, Text, Flex, Box, Link } from '@pancakeswap/uikit'

export const DYORWarning = () => {
  const { t } = useTranslation()

  return (
    <Message variant="warning" mt="8px">
      <MessageText>
        <Flex flexDirection="column">
          <Box>
            <Text fontSize={14} as="span" color="warning">
              {t('You are providing liquidity via a 3rd party liquidity manager')}
            </Text>
            <Link
              bold
              external
              m="0 4px"
              fontSize={14}
              color="warning"
              display="inline-block !important"
              href="https://www.ichi.org/"
              style={{ textDecoration: 'underline' }}
            >
              ICHI Finance
            </Link>
            <Text fontSize={14} as="span" color="warning">
              {t('which is responsible for managing the underlying assets.')}
            </Text>
          </Box>
          <Text fontSize={14} as="span" bold mt="8px" color="warning">
            {t('Please always DYOR before depositing your assets.')}
          </Text>
        </Flex>
      </MessageText>
    </Message>
  )
}
