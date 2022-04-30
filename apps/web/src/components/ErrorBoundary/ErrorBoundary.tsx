import * as Sentry from '@sentry/react'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { Button, Text, LogoIcon, Flex, IconButton, CopyIcon } from '@pancakeswap/uikit'
import { copyText } from 'utils/copyText'

export default function ErrorBoundary({ children }) {
  const { t } = useTranslation()
  return <>{children}</>
}
