import React from 'react'
import CoreIcon from 'components/icons/CoreIcon'
import useI18n from 'hooks/useI18n'
import Tag from './Tag'

const CoreTag = () => {
  const TranslateString = useI18n()

  return (
    <Tag variant="purple">
      <CoreIcon />
      <span style={{ marginLeft: '4px' }}>{TranslateString(999, 'Core')}</span>
    </Tag>
  )
}

export default CoreTag
