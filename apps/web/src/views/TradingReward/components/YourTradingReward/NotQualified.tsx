import {
  Box,
  Flex,
  Text,
  Balance,
  Message,
  MessageText,
  TooltipText,
  Button,
  LogoRoundIcon,
  Tag,
} from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import useTheme from 'hooks/useTheme'
import {
  BunnyButt,
  BunnyHead,
  BarProgress,
} from 'views/TradingReward/components/YourTradingReward/NoCakeLockedOrExtendLock'

const NotQualified = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  return (
    <Flex>
      <Box width={['236px']} mr="48px">
        <GreyCard>
          <Box>
            <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
              {t('You have earn some trading rewards')}
            </Text>
            <Balance bold fontSize={['40px']} prefix="$ " decimals={2} value={300} />
            <Balance fontSize="14px" color="textSubtle" prefix="~ " unit=" CAKE" decimals={2} value={300} />
          </Box>
          <Message variant="danger" mt="16px">
            <MessageText>
              <TooltipText bold as="span">
                $14.234
              </TooltipText>
              <Text m="0 4px" as="span">
                unclaimed reward expiring in
              </Text>
              <Text ref={targetRef} bold as="span">
                6d : 15h : 1m
              </Text>
              {tooltipVisible && tooltip}
            </MessageText>
          </Message>
        </GreyCard>
      </Box>
      <Box width={['300px']}>
        <Text bold fontSize={['24px']} color="secondary">
          {t('Lock CAKE to Claim')}
        </Text>
        <Text mb="16px" fontSize="14px" color="textSubtle">
          {t('Lock a minimum of 500 CAKE for 8 weeks or more to claim rewards from trades!')}
        </Text>
        <Flex>
          <Flex width="50%" flexDirection="column" borderRight={`solid 1px ${theme.colors.cardBorder}`}>
            <Flex>
              <LogoRoundIcon style={{ alignSelf: 'center' }} width={32} height={32} />
              <Box ml="12px">
                <Text fontSize="20px" bold>
                  200+
                </Text>
                <Balance fontSize="12px" color="textSubtle" prefix="~ " unit=" USD" decimals={2} value={300} />
              </Box>
            </Flex>
          </Flex>
          <Flex width="50%" mt="auto" flexDirection="column" padding={['0 16px']}>
            <Flex>
              <Flex position="relative" height="40px" width="40px">
                <BunnyButt />
                <BarProgress width="50%" />
                <BunnyHead />
              </Flex>
              <Tag ml="8px" variant="textSubtle">
                24 Week+
              </Tag>
            </Flex>
          </Flex>
        </Flex>
        <Flex width="100%" mt="32px">
          <Button width="100%">{t('Lock CAKE')}</Button>
          <Button width="100%" ml="16px" variant="secondary">
            {t('View Pool')}
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}

export default NotQualified
