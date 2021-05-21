import React from 'react'
import { Tag } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { ProposalState } from '../../types'

export const VoteNowTag = () => {
  const { t } = useTranslation()
  return (
    <Tag scale="sm" variant="success">
      {t('Vote Now')}
    </Tag>
  )
}

export const SoonTag = () => {
  const { t } = useTranslation()
  return (
    <Tag scale="sm" variant="binance">
      {t('Soon')}
    </Tag>
  )
}

export const ClosedTag = () => {
  const { t } = useTranslation()
  return (
    <Tag scale="sm" variant="textDisabled">
      {t('Closed')}
    </Tag>
  )
}

export const ProposalStateTag: React.FC<{ proposalState: ProposalState }> = ({ proposalState }) => {
  if (proposalState === ProposalState.ACTIVE) {
    return <VoteNowTag />
  }

  if (proposalState === ProposalState.PENDING) {
    return <SoonTag />
  }

  return <ClosedTag />
}
