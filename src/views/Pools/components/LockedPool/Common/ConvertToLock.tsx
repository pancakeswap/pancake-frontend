import { Token } from '@pancakeswap/sdk'
import { Flex, Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { memo } from 'react'
import ExtendButton from '../Buttons/ExtendDurationButton'

interface ConvertToLockProps {
  stakingToken: Token
  currentStakedAmount: number
  isInline?: boolean
}

const ConvertToLock: React.FC<ConvertToLockProps> = ({ stakingToken, currentStakedAmount, isInline }) => {
  const { t } = useTranslation()

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Flex mt={!isInline && '8px'} flexGrow={1} ml={isInline && '80px'}>
          <ExtendButton
            modalTitle={t('Convert to Lock')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentStakedAmount}
          >
            {t('Convert to Lock')}
          </ExtendButton>
        </Flex>
      }
      actionInline={isInline}
    >
      <MessageText>{t('Lock staking offers higher APY while providing other benefits.')}</MessageText>
    </Message>
  )
}

export default memo(ConvertToLock)
