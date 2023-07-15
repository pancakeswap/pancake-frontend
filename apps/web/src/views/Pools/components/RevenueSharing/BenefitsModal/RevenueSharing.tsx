import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Flex,
  Text,
  TooltipText,
  Card,
  Button,
  LinkExternal,
  Message,
  MessageText,
  WarningIcon,
} from '@pancakeswap/uikit'

const RevenueSharing = () => {
  const { t } = useTranslation()
  return (
    <Card isActive>
      <Box padding={16}>
        <Text fontSize={12} bold color="secondary" textTransform="uppercase">
          {t('revenue sharing')}
        </Text>
        <Box mt="8px">
          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              Your shares
            </TooltipText>
            <Text bold>1,557.75 (1.23%)</Text>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              Next distribution
            </TooltipText>
            <Text bold>in 7 days</Text>
          </Flex>
          <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
            <MessageText lineHeight="120%">
              {t('Your fixed-term staking position will expire before the next revenue sharing distributions.')}
            </MessageText>
          </Message>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              Last distribution
            </TooltipText>
            <Text bold>16 Jul 2023</Text>
          </Flex>

          <Flex mt="8px" flexDirection="row" alignItems="center">
            <TooltipText color="textSubtle" fontSize="14px" mr="auto">
              Available for claiming
            </TooltipText>
            <Box>
              <Text bold>51.12 CAKE</Text>
              <Text color="textSubtle" fontSize={12} textAlign="right" lineHeight="110%">
                (~ $12312.23)
              </Text>
            </Box>
          </Flex>
        </Box>
        <Message variant="danger" padding="8px" mt="24px" icon={<WarningIcon color="failure" />}>
          <MessageText lineHeight="120%">
            {t('You need to update your staking in order to start earning from protocol revenue sharing.')}
          </MessageText>
        </Message>
        <Button variant="subtle" width="100%" mt="24px">
          Claim
        </Button>
        <LinkExternal
          external
          m="8px auto auto auto"
          href="https://docs.pancakeswap.finance/products/trading-reward/how-to-participate"
        >
          {t('Learn More')}
        </LinkExternal>
      </Box>
    </Card>
  )
}

export default RevenueSharing
