/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Button } from '@pancakeswap-libs/uikit'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useSushi from '../../../hooks/useSushi'
import useI18n from '../../../hooks/useI18n'
import { getSushiAddress } from '../../../sushi/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import CardIcon from '../../CardIcon'
import Label from '../../Label'
import Modal, { ModalProps } from '../../Modal'
import ModalActions from '../../ModalActions'
import ModalContent from '../../ModalContent'
import ModalTitle from '../../ModalTitle'
import Spacer from '../../Spacer'
import Value from '../../Value'

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, reset } = useWallet()
  const TranslateString = useI18n()
  const handleSignOutClick = useCallback(() => {
    onDismiss!()
    window.localStorage.removeItem('accountStatus')
    reset()
    window.location.reload()
  }, [onDismiss, reset])

  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))

  return (
    <Modal>
      <ModalTitle text="My Account" />
      <ModalContent>
        <Spacer />

        <div style={{ display: 'flex' }}>
          <StyledBalanceWrapper>
            <CardIcon>
              <span>🥞</span>
            </CardIcon>
            <StyledBalance>
              <Value value={getBalanceNumber(sushiBalance)} />
              <Label text="CAKE Balance" />
            </StyledBalance>
          </StyledBalanceWrapper>
        </div>

        <Spacer />
        <Button
          as="a"
          fullWidth
          href={`https://bscscan.com/address/${account}`}
        >
          {TranslateString(356, 'View on BscScan')}
        </Button>
        <Spacer />
        <Button fullWidth onClick={handleSignOutClick}>
          {TranslateString(999, 'Sign out')}
        </Button>
      </ModalContent>
      <ModalActions>
        <Button fullWidth onClick={onDismiss}>
          {TranslateString(462, 'Cancel')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

export default AccountModal
