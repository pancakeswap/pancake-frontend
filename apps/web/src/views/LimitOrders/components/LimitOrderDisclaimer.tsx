import { Message, MessageText } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const LimitOrderDisclaimer = () => {
  const { t } = useTranslation()
  return (
    <Message variant="warning" mt="24px">
      <MessageText>
        <b>{t('Real Execution Price:')}</b>
        <ol>
          <li>
            {t(
              'Your execution gas fees are paid for by the spread between your specified price and the real execution price.',
            )}
          </li>
          <li>
            {t(
              'Gas fees are volatile and thus the exact market price at which your order will execute is unpredictable.',
            )}
          </li>
          <li>{t('It might take much longer than you expected to reach the price that fills your order + fees.')}</li>
        </ol>
        <br />
        <b>{t('"Fee on Transfer" Tokens')}</b>
        <ol>
          <li>{t('"Fee on transfer" tokens should not be used with Limit Orders (use at your own risk)')}</li>
        </ol>
      </MessageText>
    </Message>
  )
}

export default LimitOrderDisclaimer
