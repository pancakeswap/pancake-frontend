import { Button, useModal, Message, MessageText, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import LockedStakeModal from '../LockedStakeModal'

const LockedActions = ({ pool, performanceFee }) => {
  const { t } = useTranslation()

  const [onPresentStake] = useModal(<LockedStakeModal pool={pool} performanceFee={performanceFee} />)

  const msg =
    'The lock period has ended. To avoid more rewards being burned, we recommend you unlock your position or adjust it to start a new lock.'

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Box mt="8px">
          <Button mb="8px" width="100%">
            {t('Switch to Flexible')}
          </Button>
          <Button onClick={onPresentStake} width="100%">
            {t('Renew')}
          </Button>
        </Box>
      }
    >
      <MessageText>{msg}</MessageText>
    </Message>
  )

  return (
    <Button onClick={onPresentStake} width="100%">
      {t('Adjust')}
    </Button>
  )
}

export default LockedActions
