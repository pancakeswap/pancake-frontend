import React from 'react'
import { useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import variables from 'style/variables';

const Button = styled.button`

        background-color: ${variables.secondary};
        padding: 10px 0;
        border-radius: ${variables.radius};
        border: none;
        font-size: 16px;
        font-weight: 600;
        width: 100%;
        margin-top: 40px;
    
`;

const ConnectWalletButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Approve Contract')}
    </Button>
  )
}

export default ConnectWalletButton
