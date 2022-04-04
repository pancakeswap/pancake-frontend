import { memo } from 'react'
import { Message, MessageText, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ExtendButton from '../Buttons/ExtendDurationButton'

const ConvertToLock = ({ stakingToken, currentStakedAmount }) => {
  const { t } = useTranslation()

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Flex mt="8px">
          <ExtendButton
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentStakedAmount}
          >
            {t('Convert to Lock')}
          </ExtendButton>
        </Flex>
      }
    >
      <MessageText>{t('Lock staking offers higher APY while providing other benefits.')}</MessageText>
    </Message>
  )
}

export default memo(ConvertToLock)
