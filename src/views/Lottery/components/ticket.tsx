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
import useTickets, {useWinningNumbers, useTotalClaim} from '../../../hooks/useTickets'
import useModal from '../../../hooks/useModal'
import useSushi from '../../../hooks/useSushi'
import {getSushiAddress} from '../../../sushi/utils'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import {getBalanceNumber} from '../../../utils/formatBalance'
import useBuyLottery, {useMultiBuyLottery} from '../../../hooks/useBuyLottery'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'
import BuyModal from './buyModal'


interface StakeProps {
  lpContract: Contract
  pid: number
  tokenName: string
}

const Ticket: React.FC = () => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { account } = useWallet()

    const allowance = useLotteryAllowance()
    const {onApprove} = useLotteryApprove()

    const sushi = useSushi()
    const sushiBalance = useTokenBalance(getSushiAddress(sushi))

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
    const tickets = useTickets()
    const winNumbers = useWinningNumbers()
    const claimAmount = useTotalClaim()



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

    const [onPresentBuy] = useModal(
      <BuyModal
        max={sushiBalance}
        onConfirm={()=>{}}
        tokenName={'sss'}
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
                        <Button
                          disabled={true}
                          text={`Coming Soon`}
                        />
{/*                            {!account && <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet"/>}
                            { account && (!allowance.toNumber() ? (
                              <Button
                                disabled={requestedApproval}
                                onClick={handleApprove}
                                text={`Approve CAKE`}
                              />
                            ) : (
                              <>
                                <Button disabled={winNumbers[0]!==0} onClick={onPresentBuy} size="md" text={'Buy ticket'}/>
                              </>
                            ))}*/}
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

const MyTicketsP = styled.div`
  margin-top: 1em;
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
