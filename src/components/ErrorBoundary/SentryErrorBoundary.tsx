import { ErrorBoundary as SErrorBoundary } from '@sentry/nextjs'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, LogoIcon, Flex, IconButton, CopyIcon } from '@pancakeswap/uikit'
import { copyText } from 'utils/copyText'
import { useCallback } from 'react'

export function SentryErrorBoundary({ children }) {
  const { t } = useTranslation()
  const handleOnClick = useCallback(() => window.location.reload(), [])
  return (
    <SErrorBoundary
      beforeCapture={(scope) => {
        scope.setLevel('fatal')
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
              <Button onClick={handleOnClick}>{t('Click here to reset!')}</Button>
            </Flex>
          </Page>
        )
      }}
    >
      {children}
    </SErrorBoundary>
  )
}
