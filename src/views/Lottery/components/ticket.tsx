import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import {useLotteryAllowance} from '../../../hooks/useAllowance'
import {useLotteryApprove} from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'
import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'
import {contractAddresses} from "../../../sushi/lib/constants";
import useBuyLottery from "../../../hooks/useBuyLottery";
import useTickets, {useTotalClaim, useWinningNumbers} from "../../../hooks/useTickets";
import BuyModal from "./buyModal";
import MyTicketsModal from "./myTicketsModal";
import {currentLotteryState, LotteryStates} from "../../../lottery/types";

const Ticket: React.FC = () => {
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [requesteBuy, setRequestedBuy] = useState(false)
    const {account} = useWallet()
    const allowance = useLotteryAllowance()
    const {onApprove} = useLotteryApprove()

    const tokenBalance = useTokenBalance(contractAddresses.lottery["97"])
    const [onPresentAccountModal] = useModal(<AccountModal/>)
    const {onBuy} = useBuyLottery()
    const tickets = useTickets()
    const winNumbers = useWinningNumbers()
    const claimAmount = useTotalClaim()
    const state = currentLotteryState();

    const [onPresentDeposit] = useModal(
        <BuyModal
            max={tokenBalance}
            onConfirm={onBuy}
            tokenName={'CAKE'}
        />,
    )

    const [onPresentMyTickets] = useModal(
        <MyTicketsModal/>,
    )

    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal/>,
        'provider',
    )
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true)
            const txHash = await onApprove()
            // user rejected tx or didn't go thru
            if (!txHash) {
                setRequestedApproval(false)
            }
        } catch (e) {
            console.log(e)
        }
    }, [onApprove, setRequestedApproval])

    const handleBuy = useCallback(async () => {
        try {
            setRequestedBuy(true)
            const txHash = await onBuy('5', [3, 5, 1, 4])
            // user rejected tx or didn't go thru
            if (txHash) {
                setRequestedBuy(false)
            }
        } catch (e) {
            console.log(e)
        }
    }, [onBuy, setRequestedBuy])

    return (
        <div style={{margin: '5px', width: '400px'}}>
            <Card>
                <CardContent>
                    <StyledCardContentInner>
                        <StyledCardHeader>
                            <CardIcon>🎟</CardIcon>
                            <Value value={0} decimals={0}/>
                            <Label text={`Your total tickets for this round`}/>
                        </StyledCardHeader>
                        {state === LotteryStates.BUY_TICKETS_OPEN &&
                        <StyledCardActions>
                            {!account && <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet"/>}
                            {account && (!allowance.toNumber() ? (
                                <Button
                                    disabled={requestedApproval}
                                    onClick={handleApprove}
                                    text={`Approve CAKE`}
                                />
                            ) : (
                                <>
                                    <Button size="md" text="Buy" onClick={onPresentDeposit}/>
                                    {/*TODO: add modal to select the numbers*/}
                                    {/*<Button disabled={requesteBuy || winNumbers[0]!==0} onClick={handleBuy} size="md" text={requesteBuy ? 'Buying...': 'Buy ticket'}/>*/}
                                </>
                            ))}
                        </StyledCardActions>
                        }
                        {(state === LotteryStates.BUY_TICKETS_CLOSE || state === LotteryStates.WINNERS_ANNOUNCED) &&
                        <StyledCardActions>
                            <Button
                                disabled={true}
                                text={`Not available until next lottery`}
                            />
                        </StyledCardActions>
                        }
                        <MyTicketsP onClick={onPresentMyTickets}>View your tickets</MyTicketsP>
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