import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'
import { useCakePrice } from '../../../hooks/useTokenBalance'
import { TranslateString } from '../../../utils/translateTextHelpers'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
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
        <Button
          onClick={handleUnlockClick}
          size="sm"
          text={TranslateString(292, 'Unlock Wallet')}
        />
      ) : (
        <Button onClick={onPresentAccountModal} size="sm" text="My Wallet" />
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
