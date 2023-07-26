import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CircleLoader, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import Image from 'next/image'
import { useCallback, useState } from 'react'

const SubscribedView = ({ handleSubscribed }: { handleSubscribed: () => void }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)

  const subscribe = useCallback(
    (e) => {
      e.stopPropagation()
      setLoading(true)
      setTimeout(() => handleSubscribed(), 2250)
    },
    [handleSubscribed],
  )

  return (
    <Box padding="24px">
      <Box>
        <Image src="/IMG.png" alt="#" height={185} width={300} />
      </Box>
      <FlexGap rowGap="12px" flexDirection="column" justifyContent="center" alignItems="center">
        <Text fontSize="24px" fontWeight="600" lineHeight="120%" textAlign="center">
          Notifications From PancakeSwap
        </Text>
        <Text fontSize="16px" textAlign="center" color="textSubtle">
          Get started with notifications from WalletConnect. Click the subscribe button below and accept.
        </Text>
        <Button
          marginTop="8px"
          variant="primary"
          width="100%"
          onClick={subscribe}
          disabled={loading}
          isLoading={loading}
        >
          <Flex alignItems="center">
            <Text px="4px" fontWeight="bold" color="white">
              {t('Enable (Subscribe in wallet)')}
            </Text>
            {loading ? <CircleLoader stroke="white" /> : null}
          </Flex>
        </Button>
      </FlexGap>
    </Box>
  )
}

export default SubscribedView
