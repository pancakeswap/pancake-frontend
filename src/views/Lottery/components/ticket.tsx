import BigNumber from 'bignumber.js'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import {Contract} from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'

import { useLotteryAllowance } from '../../../hooks/useAllowance'
import { useLotteryApprove } from '../../../hooks/useApprove'
import useTickets, {useWinningNumbers} from '../../../hooks/useTickets'
import useModal from '../../../hooks/useModal'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import {getBalanceNumber} from '../../../utils/formatBalance'
import useBuyLottery from '../../../hooks/useBuyLottery'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'

interface StakeProps {
    lpContract: Contract
    pid: number
    tokenName: string
}

const Ticket: React.FC = () => {
    const [requestedApproval, setRequestedApproval] = useState(false)
    const {account} = useWallet()

    const allowance = useLotteryAllowance()
    const {onApprove} = useLotteryApprove()
    //
    // const tokenBalance = useTokenBalance(lpContract.options.address)
    // const stakedBalance = useStakedBalance(pid)
    //
    // const {onStake} = useStake(pid)
    // const {onUnstake} = useUnstake(pid)

    // TODO:
    // const [onPresentBuy] = useModal(
    // )

    // TEMP example
    const { onBuy } = useBuyLottery()
    const tickets = useTickets()

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

    const [onPresentAccountModal] = useModal(<AccountModal/>)
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal/>,
        'provider',
    )
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    return (
        <div style={{margin: '5px', width: '300px'}}>
            <Card>
                <CardContent>
                    <StyledCardContentInner>
                        <StyledCardHeader>
                            <CardIcon>🎟</CardIcon>
                            <Value value={tickets.length} decimals={0}/>
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
                                {/*TODO: add modal to select the numbers*/}
                                <Button disabled={requestedApproval} onClick={() => onBuy('3', [1,2,3,4])} size="md" text="Buy ticket"/>
                              </>
                            ))}
                        </StyledCardActions>
                    </StyledCardContentInner>
                </CardContent>
            </Card>
            {/*TODO: improve the style*/}
            <div>
              <p>your  tickets:</p>
              {tickets.map((numbers, index)=>
                <div key={index}>
                {numbers.map((i,j)=><span  key={j}>{i} </span>)}
                </div>
              )}
            </div>
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

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
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
