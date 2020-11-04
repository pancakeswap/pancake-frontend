import React from 'react'
import CommunityIcon from 'components/icons/CommunityIcon'
import useI18n from 'hooks/useI18n'
import Tag from './Tag'

const CommunityTag = () => {
  const TranslateString = useI18n()

  return (
    <Tag variant="pink">
      <CommunityIcon />
      <span style={{ marginLeft: '4px' }}>
        {TranslateString(999, 'Community')}
      </span>
    </Tag>
  )
}

export default CommunityTag
