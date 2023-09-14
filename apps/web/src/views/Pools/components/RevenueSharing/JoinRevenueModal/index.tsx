import { useMemo } from 'react'
import { styled } from 'styled-components'
import { Modal, Text, Card, Flex, Box, LinkExternal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import Image from 'next/image'
import useTheme from 'hooks/useTheme'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import JoinButton from 'views/Pools/components/RevenueSharing/JoinRevenueModal/JoinButton'
import { useVaultPoolByKey, usePoolsWithVault } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedCakeVault } from 'state/types'
import LockedStaking from 'views/Pools/components/LockedPool/LockedStaking'

interface JoinRevenueModalProps {
  refresh?: () => void
  onDismiss?: () => void
}

const TooltipContainer = styled(Box)`
  position: relative;
  padding: 16px;
  max-width: 264px;
  margin: 0 0 10px 10px;
  height: fit-content;
  border-radius: 16px;
  background-color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#27262c')};

  ${Text} {
    color: ${({ theme }) => (theme.isDark ? '#280D5F' : '#F4EEFF')};
  }

  &:before {
    content: '';
    position: absolute;
    bottom: 25%;
    right: -6px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: ${({ theme }) => (theme.isDark ? '10px solid #FFFFFF' : '10px solid #27262c')};
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 0 0 10px;
  }
`

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  margin: 0 4px;

  svg {
    width: 16px;
  }
`

const JoinRevenueModal: React.FunctionComponent<React.PropsWithChildren<JoinRevenueModalProps>> = ({
  refresh,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const { pools } = usePoolsWithVault()
  const cakePool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>

  const vaultPool = useVaultPoolByKey(VaultKey.CakeVault) as DeserializedLockedCakeVault

  return (
    <Modal
      title={t('Join revenue sharing')}
      width={['100%', '100%', '100%', '454px']}
      headerBackground={theme.colors.gradientCardHeader}
      onDismiss={onDismiss}
    >
      <Box padding="0 13px">
        <Flex position="relative" zIndex="1" bottom="-5px" m={['auto', 'auto', 'auto', '0 0 0 auto']}>
          <TooltipContainer>
            <Text fontSize={['14px', '14px', '14px', '16px']} lineHeight="110%">
              {
                'Update your CAKE staking position to join the revenue sharing program for weekly revenue sharing distributions! '
              }
            </Text>
          </TooltipContainer>
          <Image
            alt="lockCakeTooltip"
            width={isMobile ? 100 : 122}
            height={isMobile ? 100 : 122}
            style={{
              marginTop: 'auto',
              maxWidth: isMobile ? '100px' : '122px',
              maxHeight: isMobile ? '100px' : '122px',
            }}
            src="/images/pool/lockcaketooltip.png"
          />
        </Flex>
        {!vaultPool?.userData?.isLoading && (
          <Card>
            <Box padding="16px 16px 0 16px">
              <LockedStaking buttonVariant="secondary" pool={cakePool} userData={vaultPool?.userData} />
            </Box>
          </Card>
        )}
        <JoinButton refresh={refresh} onDismiss={onDismiss} />
        <Box>
          <Text as="span" fontSize={12} color="textSubtle">
            {t('Once updated, you need to wait a full distribution cycle to start claiming rewards.')}
          </Text>
          <InlineLink
            fontSize={12}
            href="https://docs.pancakeswap.finance/products/revenue-sharing/faq#cae64522-4729-43a2-8fa8-6bbd2567dcea"
            external
          >
            {t('Learn More')}
          </InlineLink>
        </Box>
      </Box>
    </Modal>
  )
}

export default JoinRevenueModal
