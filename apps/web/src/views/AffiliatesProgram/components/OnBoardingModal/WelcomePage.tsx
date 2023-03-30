import { Flex, Box, Text, Button, LogoRoundIcon, Checkbox, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'

interface WelcomePageProps {
  isLoading: boolean
  handleStartNow: () => void
}

const WelcomePage: React.FC<React.PropsWithChildren<WelcomePageProps>> = ({ isLoading, handleStartNow }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckbox = () => setIsChecked(!isChecked)

  const isReady = useMemo(() => !isLoading && isChecked, [isLoading, isChecked])

  return (
    <Flex flexDirection="column" padding={['24px', '24px', '24px', '24px', '50px 24px']}>
      <Box>
        <LogoRoundIcon width="48px" />
      </Box>
      <Box>
        <Text fontSize={['24px']} bold m="12px 0">
          {t('Welcome to PancakeSwap!')}
        </Text>
        <Text textTransform="uppercase" color="secondary" bold mb="8px">
          {router.query.user?.toString()?.replaceAll('_', ' ')}
        </Text>
        <Text color="textSubtle" fontSize="14px" mb="24px">
          {t('has referred you to start trading on PancakeSwap')}
        </Text>
        <Text color="textSubtle" mb="24px">
          {t('Start trading today and get a')}
          <Text color="secondary" bold as="span" m="0 4px">{`${router.query.discount}%`}</Text>
          {t('discount on most Swap and StableSwap trading fees, as well as a')}
          <Text color="secondary" bold as="span" m="0 4px">
            20%
          </Text>
          {t('discount on most Perpetual trading fees for a limited period of time*')}
        </Text>
        <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
          <Flex alignItems="center">
            <div style={{ flex: 'none' }}>
              <Checkbox id="checkbox" scale="sm" checked={isChecked} onChange={handleCheckbox} />
            </div>
            <Text fontSize="14px" ml="8px">
              {t('*I have read the')}
              <Text display="inline-block" as="span" ml="4px">
                <Link external href="https://docs.pancakeswap.finance/">
                  {t('terms and conditions')}
                </Link>
              </Text>
            </Text>
          </Flex>
        </label>
        <Button width="100%" disabled={!isReady} onClick={handleStartNow}>
          {t('Start Now')}
        </Button>
      </Box>
    </Flex>
  )
}

export default WelcomePage
