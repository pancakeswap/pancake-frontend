import { Flex, Box, Text, Button, LogoRoundIcon, Checkbox, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'

interface WelcomePageProps {
  isLoading: boolean
  onDismiss: () => void
  handleStartNow: () => void
}

const WelcomePage: React.FC<React.PropsWithChildren<WelcomePageProps>> = ({ isLoading, onDismiss, handleStartNow }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address } = useAccount()
  const { isUserExist } = useUserExist()
  const { user, discount, noperps } = router.query
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckbox = () => setIsChecked(!isChecked)

  const isDiscountZero = useMemo(() => new BigNumber((discount as string) ?? '0').eq(0), [discount])

  const noPerps = useMemo(() => (noperps as string) === 'true', [noperps])

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
          {user?.toString()?.replaceAll('_', ' ')}
        </Text>
        <Text color="textSubtle" fontSize="14px" mb="24px">
          {t('has referred you to start trading on PancakeSwap')}
        </Text>
        {isDiscountZero && noPerps ? null : (
          <Text color="textSubtle" mb="24px">
            {t('Start trading today and get a')}
            {!isDiscountZero && (
              <>
                <Text color="secondary" bold as="span" m="0 4px">{`${discount}%`}</Text>
                {t('discount on most Swap and StableSwap trading fees')}
              </>
            )}
            {!isDiscountZero && !noPerps ? (
              <Text color="textSubtle" as="span" m="0 4px">
                {t('as well as a')}
              </Text>
            ) : null}
            {!noPerps && (
              <>
                <Text color="secondary" bold as="span" m="0 4px">
                  20%
                </Text>
                <Text color="textSubtle" as="span" m="0 4px">
                  {t('discount on most Perpetual trading fees')}
                </Text>
              </>
            )}
            <Text color="textSubtle" as="span" m="0 4px">
              {t('for a limited period of time*')}
            </Text>
          </Text>
        )}
        <label htmlFor="checkbox" style={{ display: 'block', cursor: 'pointer', marginBottom: '24px' }}>
          <Flex alignItems="center">
            <div style={{ flex: 'none' }}>
              <Checkbox id="checkbox" scale="sm" checked={isChecked} onChange={handleCheckbox} />
            </div>
            <Text fontSize="14px" ml="8px">
              {t('*I have read the')}
              <Text display="inline-block" as="span" ml="4px">
                <Link external href="https://docs.pancakeswap.finance/affiliate-program/terms-and-conditions">
                  {t('terms and conditions')}
                </Link>
              </Text>
            </Text>
          </Flex>
        </label>
        {address ? (
          <>
            {!isUserExist ? (
              <Button width="100%" disabled={!isReady} onClick={handleStartNow}>
                {t('Start Now')}
              </Button>
            ) : (
              <Button width="100%" onClick={onDismiss}>
                {t('Close')}
              </Button>
            )}
          </>
        ) : (
          <ConnectWalletButton width="100%" />
        )}
      </Box>
    </Flex>
  )
}

export default WelcomePage
