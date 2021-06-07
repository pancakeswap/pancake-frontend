import React from 'react'
import { Button, InjectedModalProps, Modal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useGetVotingPower from 'views/Voting/hooks/useGetVotingPower'

interface CastVoteModalProps extends InjectedModalProps {
  block?: number
}

const CastVoteModal: React.FC<CastVoteModalProps> = ({ block, onDismiss }) => {
  const { t } = useTranslation()
  const { votingPower, isInitialized } = useGetVotingPower(block)

  return (
    <Modal title={t('Cast Vote')} onDismiss={onDismiss}>
      {votingPower.toString()}
      {isInitialized}
      <Button disabled={!isInitialized}>{t('Confirm Vote')}</Button>
    </Modal>
  )
}

export default CastVoteModal
