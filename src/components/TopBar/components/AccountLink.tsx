import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import ButtonMenu from "../../Button/ButtonMenu";

interface AccountButtonProps {}

const AccountLink: React.FC = (props) => {
    const [onPresentAccountModal] = useModal(<AccountModal />)
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal />,
        'provider',
    )

    const { account, connect, status } = useWallet()

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])


    return (
        <StyledAccountButton>
            {!account ? (
                <ButtonMenu onClick={handleUnlockClick} size="sm"  text="🔓 Unlock Wallet" />
            ) : (
                <ButtonMenu onClick={onPresentAccountModal} size="sm" text="🔒 My Wallet" />
            )}
        </StyledAccountButton>
    )
}

const StyledAccountButton = styled.div`
background: none !important;
border: none;
`
const StyledAccountButtonP = styled.div`
background: none !important;
border: none;
`

export default AccountLink
