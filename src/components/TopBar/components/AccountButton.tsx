import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Button } from '@pancakeswap-libs/uikit'
import useModal from '../../../hooks/useModal'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import { useCakePrice } from '../../../hooks/useTokenBalance'
import useI18n from '../../../hooks/useI18n'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const TranslateString = useI18n()
  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )

  const { account } = useWallet()

  const cakePrice = useCakePrice()

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <StyledAccountButton>
      {!account ? (
        <Button onClick={handleUnlockClick} size="sm">
          {TranslateString(292, 'Unlock Wallet')}
        </Button>
      ) : (
        <Button onClick={onPresentAccountModal} size="sm">
          {TranslateString(999, 'My Wallet')}
        </Button>
      )}
      {account && (
        <PriceTag>
          {TranslateString(358, 'CAKE PRICE')}: <b>${cakePrice.toFixed(3)}</b>
        </PriceTag>
      )}
    </StyledAccountButton>
  )
}

const PriceTag = styled.div`
  position: absolute;
  font-size: 14px;
  color: #7645d9;
  font-weight: 100;
  width: 160px;
  text-align: right;
  right: 0;
  b {
    color: ${(props) => props.theme.colors.primary};
  }
`

const StyledAccountButton = styled.div`
  position: relative;
`

export default AccountButton
