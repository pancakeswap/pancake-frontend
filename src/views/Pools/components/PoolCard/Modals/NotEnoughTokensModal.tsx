import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Modal, Text, Button, OpenNewIcon, Link } from '@pancakeswap-libs/uikit'
import { BASE_EXCHANGE_URL } from 'config'
import useTheme from 'hooks/useTheme'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Modal
      title={`${tokenSymbol} ${t('required')}`}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Text color="failure" bold>
        {t('Insufficient %tokensymbol% balance', { tokensymbol: tokenSymbol })}
      </Text>
      <Text mt="24px">{t(`You’ll need %tokensymbol% to stake in this pool!`, { tokensymbol: tokenSymbol })}</Text>
      <Text>
        {t(`Buy some %tokensymbol%, or make sure your %tokensymbol% isn’t in another pool or LP.`, {
          tokensymbol: tokenSymbol,
        })}
      </Text>
      <Button mt="24px" as="a" external href={BASE_EXCHANGE_URL}>
        {t('Buy')} {tokenSymbol}
      </Button>
      <StyledLink href="https://yieldwatch.net" external>
        <Button variant="secondary" mt="8px" width="100%">
          {t('Locate Assets')}
          <OpenNewIcon color="primary" ml="4px" />
        </Button>
      </StyledLink>
      <Button variant="text" onClick={onDismiss}>
        {t('Close window')}
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
