import React from 'react'
import { Button, Flex, InjectedModalProps } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useProfile } from 'state/hooks'

type RemovePageProps = InjectedModalProps

const RemovePage: React.FC<RemovePageProps> = ({ onDismiss }) => {
  const { profile } = useProfile()
  const TranslateString = useI18n()

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      Remove
      <Button variant="text" fullWidth onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Flex>
  )
}

export default RemovePage
