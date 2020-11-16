import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Button } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import Card from 'components/Card'
import CardContent from 'components/CardContent'
import CardIcon from 'components/CardIcon'
import Label from 'components/Label'
import Value from 'components/Value'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useLotteryAllowance } from 'hooks/useAllowance'
import { useLotteryApprove } from 'hooks/useApprove'
import useTickets from 'hooks/useTickets'
import useModal from 'hooks/useModal'
import useSushi from 'hooks/useSushi'
import useTokenBalance from 'hooks/useTokenBalance'
import { getSushiAddress } from 'sushi/utils'
import WalletProviderModal from 'components/WalletProviderModal'
import BuyTicketModal from './BuyTicketModal'
import MyTicketsModal from './UserTicketsModal'
import PurchaseWarningModal from './PurchaseWarningModal'

const TicketCard: React.FC = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()
  const TranslateString = useI18n()
  const allowance = useLotteryAllowance()
  const { onApprove } = useLotteryApprove()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))

  const tickets = useTickets()
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)

  const ticketsLength = tickets.length

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
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  const [onPresentBuy] = useModal(<BuyTicketModal max={sushiBalance} tokenName="CAKE" />)

  const [onPresentApprove] = useModal(<PurchaseWarningModal />)

  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />, 'provider')
  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  // Hide this component if numbers have been drawn
  if (lotteryHasDrawn) {
    return null
  }

  return (
    <div style={{ margin: '5px', width: '380px' }}>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>🎟</CardIcon>
              <Value value={ticketsLength} decimals={0} />
              <Label text={TranslateString(428, 'Your total tickets for this round')} />
            </StyledCardHeader>
            <StyledCardActions>
              {!account && (
                <Button fullWidth onClick={handleUnlockClick}>
                  {TranslateString(999, 'Unlock Wallet')}
                </Button>
              )}
              {account &&
                (!allowance.toNumber() ? (
                  <Button fullWidth disabled={requestedApproval} onClick={handleApprove}>
                    {TranslateString(998, 'Approve CAKE')}
                  </Button>
                ) : (
                  <>
                    <Button fullWidth onClick={onPresentBuy}>
                      {TranslateString(430, 'Buy ticket')}
                    </Button>
                  </>
                ))}
            </StyledCardActions>
            {account && ticketsLength > 0 && (
              <MyTicketsP onClick={onPresentMyTickets}>{TranslateString(432, 'View your tickets')}</MyTicketsP>
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

export default TicketCard
