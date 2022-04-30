import React from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, BunnyPlaceholderIcon, Button, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import LockedStakeModal from 'views/Pools/components/LockedPool/Modals/LockedStakeModal'
import { MessageTextLink } from '../IfoCardStyles'

interface NotTokensProps {
  pool: DeserializedPool
  account: string
}

const NotTokens: React.FC<NotTokensProps> = ({ account, pool }) => {
  const { t } = useTranslation()
  const { stakingToken, userData } = pool
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakeModal
      currentBalance={stakingTokenBalance}
      stakingToken={stakingToken}
      stakingTokenBalance={stakingTokenBalance}
    />,
  )

  return (
    <Flex flexDirection="column">
      <BunnyPlaceholderIcon width={80} height={80} margin="auto" />
      <Flex flexDirection="column" alignItems="center" mt="16px" mb="24px">
        <Text bold mb="8px" textAlign="center">
          {t('You have no tokens available for claiming')}
        </Text>
        <Text fontSize="14px" color="textSubtle" textAlign="center">
          {t('Participate in our next IFO. and remember to lock your CAKE to increase your allocation!')}
        </Text>
        <MessageTextLink href="/ifo#ifo-how-to" color="primary" display="inline">
          {t('How does it work?')} »
        </MessageTextLink>
      </Flex>
      {account ? <Button onClick={openPresentLockedStakeModal}>{t('Lock CAKE')}</Button> : <ConnectWalletButton />}
    </Flex>
  )
}

export default NotTokens
