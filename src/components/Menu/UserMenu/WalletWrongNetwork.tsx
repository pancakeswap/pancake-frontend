import React from 'react'
import { Button, Text, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'

const LinkButton = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

const WalletWrongNetwork: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      <LinkButton href="https://docs.pancakeswap.finance/get-started/connection-guide" external>
        <Button width="100%" variant="subtle">
          {t('Learn How')}
        </Button>
      </LinkButton>
    </>
  )
}

export default WalletWrongNetwork
