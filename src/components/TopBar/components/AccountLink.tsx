import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import { useCakePrice } from '../../../hooks/useTokenBalance'
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

    const cakePrice = useCakePrice()

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])


    return (
        <StyledAccountButton>
            {account && <PriceTag>CAKE PRICE: <b>${cakePrice.toFixed(3)}</b></PriceTag>}
            {!account ? (
                <ButtonMenu onClick={handleUnlockClick} size="sm"  text="🔓 Unlock Wallet" />
            ) : (
                <ButtonMenu onClick={onPresentAccountModal} size="sm" text="🔒 My Wallet" />
            )}
        </StyledAccountButton>
    )
}
const PriceTag = styled.div`
  font-size: 18px;
  color: #7645D9;
  font-weight: 100;
  width: 160px;
  text-align: center;
  right: 0;
  margin: 20px auto;
  b {
    color: ${(props) => props.theme.colors.primary};
  }
`


const StyledAccountButton = styled.div`
background: none !important;
border: none;
`
const StyledAccountButtonP = styled.div`
background: none !important;
border: none;
`

export default AccountLink
