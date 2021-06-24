import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Modal, Flex, Button, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { LotteryTicketClaimData } from 'config/constants/types'
import { getBalanceAmount } from 'utils/formatBalance'
import { useAppDispatch } from 'state'
import { fetchUserLotteries } from 'state/lottery'
import { usePriceCakeBusd } from 'state/hooks'
import Balance from 'components/Balance'
import useToast from 'hooks/useToast'
import { useLotteryV2Contract } from 'hooks/useContract'
import { parseClaimDataForClaimTicketsCall } from '../helpers'
import ClaimPrizesInner from './ClaimPrizesInner'

const StyledModal = styled(Modal)`
  min-width: 280px;
  /* max-width: 320px; */

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

interface ClaimPrizesModalModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimPrizesModal: React.FC<ClaimPrizesModalModalProps> = ({ onDismiss, roundsToClaim }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  return (
    <StyledModal
      title={`${t('Collect winnings')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <ClaimPrizesInner
        onSuccess={() => {
          onDismiss()
          dispatch(fetchUserLotteries({ account }))
        }}
        roundsToClaim={roundsToClaim}
      />
    </StyledModal>
  )
}

export default ClaimPrizesModal
