import React from 'react'
import * as Sentry from '@sentry/react'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { Button, Text, LogoIcon, Flex } from '@pancakeswap/uikit'

export default function ErrorBoundary({ children, name }) {
  const { t } = useTranslation()
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setLevel(Sentry.Severity.Fatal)
        scope.setTag('name', name)
      }}
      fallback={() => {
        return (
          <Page>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <LogoIcon width="64px" mb="8px" />
              <Text mb="16px">{t('Oops, something wrong.')}</Text>
            </Flex>
          </Page>
        )
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
