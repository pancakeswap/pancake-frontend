import React from 'react'
import { BunnyPlaceholderIcon, Flex, Heading } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface ComingSoonProps {
  children?: React.ReactNode
}

const ComingSoon: React.FC<ComingSoonProps> = ({ children }) => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px">
      <BunnyPlaceholderIcon width="72px" height="72px" />
      <Heading as="h5" size="md" color="textDisabled">
        {children || TranslateString(999, 'Coming Soon!')}
      </Heading>
    </Flex>
  )
}

export default ComingSoon
