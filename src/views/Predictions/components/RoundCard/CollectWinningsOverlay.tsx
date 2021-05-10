import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, TrophyGoldIcon } from '@pancakeswap/uikit'
import { useBetCanClaim } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import CollectWinningsButton from '../CollectWinningsButton'

interface CollectWinningsOverlayProps {
  roundId: string
  epoch: number
  payout: number
  isBottom?: boolean
}

const Wrapper = styled(Flex)<{ isBottom: CollectWinningsOverlayProps['isBottom'] }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 30;

  ${({ isBottom }) => {
    return isBottom
      ? `
      border-radius: 0 0 16px 16px;
      bottom: 0;
    `
      : `
      top: 37px; // Card header height
    `
  }}
`

const CollectWinningsOverlay: React.FC<CollectWinningsOverlayProps> = ({
  roundId,
  epoch,
  payout,
  isBottom = false,
  ...props
}) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const canClaim = useBetCanClaim(account, roundId)

  if (!canClaim) {
    return null
  }

  return (
    <Wrapper alignItems="center" p="16px" isBottom={isBottom} {...props}>
      <TrophyGoldIcon width="64px" style={{ flex: 'none' }} mr="8px" />
      <CollectWinningsButton payout={payout} roundId={roundId} epoch={epoch} hasClaimed={false} width="100%">
        {t('Collect Winnings')}
      </CollectWinningsButton>
    </Wrapper>
  )
}

export default CollectWinningsOverlay
