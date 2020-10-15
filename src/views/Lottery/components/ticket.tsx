import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import WalletProviderModal from '../../../components/WalletProviderModal'
import { TranslateString } from '../../../utils/translateTextHelpers'
import BuyModal from "./BuyModal";

const Ticket: React.FC = () => {
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )
  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  const [onPresentBuy] = useModal(
      <BuyModal
          max={null}
          onConfirm={null}
          tokenName={'TICKET'}
      />,
  )


  return (
    <div style={{ margin: '5px', width: '400px' }}>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>🎟</CardIcon>
              <Value value={0} decimals={0} />
              <Label text={`Your total tickets for this round`} />
            </StyledCardHeader>
            <StyledCardActions>
              {!account && (
                <Button
                  onClick={handleUnlockClick}
                  size="md"
                  text={TranslateString(292, 'Unlock Wallet')}
                />
              )}
              {account && <Button onClick={null} size="md" text="Buy ticket" />}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
    </div>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Ticket