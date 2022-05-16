import * as Sentry from '@sentry/react'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { Button, Text, LogoIcon, Flex, IconButton, CopyIcon } from '@pancakeswap/uikit'
import { copyText } from 'utils/copyText'

export default function ErrorBoundary({ children }) {
  const { t } = useTranslation()
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setLevel(Sentry.Severity.Fatal)
      }}
      fallback={({ eventId }) => {
        return (
          <Page>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <LogoIcon width="64px" mb="8px" />
              <Text mb="16px">{t('Oops, something wrong.')}</Text>
              {eventId && (
                <Flex flexDirection="column" style={{ textAlign: 'center' }} mb="8px">
                  <Text>{t('Error Tracking Id')}</Text>
                  <Flex alignItems="center">
                    <Text>{eventId}</Text>
                    <IconButton variant="text" onClick={() => copyText(eventId)}>
                      <CopyIcon color="primary" width="24px" />
                    </IconButton>
                  </Flex>
                </Flex>
              )}
              <Button onClick={() => window.location.reload()}>{t('Click here to reset!')}</Button>
            </Flex>
          </Page>
        )
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
