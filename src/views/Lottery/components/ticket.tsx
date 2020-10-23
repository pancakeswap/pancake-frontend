import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'

import { useLotteryAllowance } from '../../../hooks/useAllowance'
import { useLotteryApprove } from '../../../hooks/useApprove'
import useTickets, { useWinningNumbers } from '../../../hooks/useTickets'
import useModal from '../../../hooks/useModal'
import useSushi from '../../../hooks/useSushi'
import { getSushiAddress } from '../../../sushi/utils'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'
import BuyModal from './buyModal'
import MyTicketsModal from './myTicketsModal'
import WarningModal from './warningModal'
import useI18n from '../../../hooks/useI18n'

interface TicketProps {
  state?: boolean
}

const Ticket: React.FC<TicketProps> = ({ state }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const TranslateString = useI18n()
  const allowance = useLotteryAllowance()
  const { onApprove } = useLotteryApprove()

  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))

  const tickets = useTickets()
  const [onPresentMyTickets] = useModal(
    <MyTicketsModal myTicketNumbers={tickets} from={'buy'} />,
  )

  const ticketsLength = tickets.length
  const winNumbers = useWinningNumbers()

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
      onPresentApprove()
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])

  const [onPresentBuy] = useModal(
    <BuyModal max={sushiBalance} onConfirm={() => {}} tokenName={'CAKE'} />,
  )

  const [onPresentApprove] = useModal(
    <WarningModal
      title={TranslateString(466, 'Warning')}
      text={[
        TranslateString(468, 'Lottery ticket purchases are final.'),
        TranslateString(
          470,
          'Your CAKE will not be returned to you after you spend it to buy tickets.',
        ),
        TranslateString(
          472,
          'Tickets are only valid for one lottery draw, and will be burnedafter the draw.',
        ),
        TranslateString(
          474,
          'Buying tickets does not guarantee you will win anything. Please only participate once you understand the risks.',
        ),
      ].join(' ')}
    />,
  )

  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )
  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <div style={{ margin: '5px', width: '380px' }}>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>🎟</CardIcon>
              <Value value={ticketsLength} decimals={0} />
              <Label
                text={TranslateString(428, 'Your total tickets for this round')}
              />
            </StyledCardHeader>
            <StyledCardActions>
              {!account && (
                <Button
                  onClick={handleUnlockClick}
                  size="md"
                  text="Unlock Wallet"
                />
              )}
              {account &&
                (!allowance.toNumber() ? (
                  <Button
                    disabled={requestedApproval}
                    onClick={handleApprove}
                    text={TranslateString(998, 'Approve CAKE')}
                  />
                ) : (
                  <>
                    <Button
                      onClick={onPresentBuy}
                      size="md"
                      text={TranslateString(430, 'Buy ticket')}
                    />
                  </>
                ))}
            </StyledCardActions>
            {account && ticketsLength > 0 && (
              <MyTicketsP onClick={onPresentMyTickets}>
                {TranslateString(432, 'View your tickets')}
              </MyTicketsP>
            )}

            {ticketsLength === 0 && <br />}
            {ticketsLength === 0 && <br />}
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

const MyTicketsP = styled.div`
  cursor: pointer;
  margin-top: 1.35em;
  color: ${(props) => props.theme.colors.secondary};
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Ticket
