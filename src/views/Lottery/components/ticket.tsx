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
import {getSushiAddress} from '../../../sushi/utils'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import {getBalanceNumber} from '../../../utils/formatBalance'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'
import BuyModal from './buyModal'
import MyTicketsModal from "./myTicketsModal";
import WarningModal from "./warningModal"


interface TicketProps {
  state?: boolean
}

const Ticket: React.FC<TicketProps> = ({state}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()

    const allowance = useLotteryAllowance()
    const {onApprove} = useLotteryApprove()

    const sushi = useSushi()
    const sushiBalance = useTokenBalance(getSushiAddress(sushi))

    const tickets = useTickets()
    const [onPresentMyTickets] = useModal(
        <MyTicketsModal myTicketNumbers={tickets}/>,
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
      <BuyModal
        max={sushiBalance}
        onConfirm={()=>{}}
        tokenName={'CAKE'}
      />,
    )

    const [onPresentApprove] = useModal(
      <WarningModal
        title={'Warning'}
        text={'Lottery ticket purchases are final.Your CAKE will not be returned to you after you spend it to buy tickets.Tickets are only valid for one lottery draw, and will be burned after the draw.Buying tickets does not guarantee you will win anything. Please only participate once you understand the risks.'}
      />,
    )


    const [onPresentAccountModal] = useModal(<AccountModal/>)
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal/>,
        'provider',
    )
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    return (
        <div style={{margin: '5px', width: '400px'}}>
            <Card>
                <CardContent>
                    <StyledCardContentInner>
                        <StyledCardHeader>
                            <CardIcon>🎟</CardIcon>
                            <Value value={ticketsLength} decimals={0}/>
                            <Label text={`Your total tickets for this round`}/>
                        </StyledCardHeader>
                        <StyledCardActions>
                          {!account && <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet"/>}
                          { account && (!allowance.toNumber() ? (
                            <Button
                              disabled={requestedApproval}
                              onClick={handleApprove}
                              text={`Approve CAKE`}
                            />
                          ) : (
                            <>
                              <Button onClick={onPresentBuy} size="md" text={'Buy ticket'}/>
                            </>
                          ))}
                    </StyledCardActions>
                    {account && ticketsLength > 0 && <MyTicketsP onClick={onPresentMyTickets}>View your tickets</MyTicketsP>}
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
