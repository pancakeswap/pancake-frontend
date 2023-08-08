import { useTranslation } from '@pancakeswap/localization'
import {
  ModalV2,
  useModalV2,
  Flex,
  Text,
  Box,
  PreTitle,
  MessageText,
  Message,
  InfoFilledIcon,
} from '@pancakeswap/uikit'
import StyledButton from '@pancakeswap/uikit/src/components/Button/StyledButton'
import { ReactNode } from 'react'
import Divider from 'components/Divider'
import { Token } from '@pancakeswap/sdk'

import ConnectWalletButton from 'components/ConnectWalletButton'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { FixedStakingPool } from '../type'
import FixedStakingOverview from './FixedStakingOverview'
import { StakingModalTemplate } from './StakingModalTemplate'

export function FixedStakingModal({
  stakingToken,
  pools,
  children,
  initialLockPeriod,
  stakedPeriods,
  setSelectedPeriodIndex,
}: {
  stakingToken: Token
  pools: FixedStakingPool[]
  children: (openModal: () => void) => ReactNode
  initialLockPeriod: number
  stakedPeriods: number[]
  setSelectedPeriodIndex?: (value: number | null) => void
}) {
  const { account } = useAccountActiveChain()

  const { t } = useTranslation()
  const stakeModal = useModalV2()

  return account ? (
    <>
      {children(stakeModal.onOpen)}
      <ModalV2
        {...stakeModal}
        onDismiss={() => {
          if (setSelectedPeriodIndex) setSelectedPeriodIndex(null)
          stakeModal.onDismiss()
        }}
        closeOnOverlayClick
      >
        <StakingModalTemplate
          stakingToken={stakingToken}
          pools={pools}
          initialLockPeriod={initialLockPeriod}
          stakedPeriods={stakedPeriods}
          body={({ setLockPeriod, stakeCurrencyAmount, lockPeriod, isStaked, boostAPR, lockAPR }) => (
            <>
              {pools.length > 1 ? (
                <>
                  <PreTitle textTransform="uppercase" bold mb="8px">
                    {t('Stake Duration')}
                  </PreTitle>
                  <Flex>
                    {pools.map((pool) => (
                      <StyledButton
                        key={pool.lockPeriod}
                        scale="md"
                        variant={pool.lockPeriod === lockPeriod ? 'danger' : 'bubblegum'}
                        width="100%"
                        mx="2px"
                        onClick={() => setLockPeriod(pool.lockPeriod)}
                      >
                        {pool.lockPeriod}D
                      </StyledButton>
                    ))}
                  </Flex>
                  {isStaked ? (
                    <Message variant="warning" my="8px">
                      <MessageText maxWidth="200px">
                        {`You already have a position in ${lockPeriod}D lock period, adding stake to the position will restart the whole locking period.`}
                      </MessageText>
                    </Message>
                  ) : (
                    <Flex my="8px">
                      <InfoFilledIcon
                        style={{
                          alignSelf: 'baseline',
                          marginTop: '4px',
                          marginRight: '8px',
                        }}
                        color="textSubtle"
                        mr="4px"
                      />
                      <Text fontSize="14px" color="textSubtle">
                        {t('A withdrawal fee of 2% will be applied if amount is unstaked before locked period is up.')}
                      </Text>
                    </Flex>
                  )}
                  <Divider />
                </>
              ) : null}

              <Box mb="16px" mt="16px">
                <PreTitle textTransform="uppercase" bold mb="8px">
                  {t('Position Overview')}
                </PreTitle>
                <FixedStakingOverview
                  stakeAmount={stakeCurrencyAmount}
                  lockAPR={lockAPR}
                  boostAPR={boostAPR}
                  lockPeriod={lockPeriod}
                />
              </Box>
            </>
          )}
        />
      </ModalV2>
    </>
  ) : (
    <ConnectWalletButton />
  )
}
