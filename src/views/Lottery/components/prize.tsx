import BigNumber from 'bignumber.js'
import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import {Contract} from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import {AddIcon} from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import {getBalanceNumber} from '../../../utils/formatBalance'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'

interface StakeProps {
    lpContract: Contract
    pid: number
    tokenName: string
}

const Prize: React.FC = () => {
    const [requestedApproval, setRequestedApproval] = useState(false)
    const {account} = useWallet()

    // const allowance = useAllowance(lpContract)
    // const {onApprove} = useApprove(lpContract)
    //
    // const tokenBalance = useTokenBalance(lpContract.options.address)
    // const stakedBalance = useStakedBalance(pid)
    //
    // const {onStake} = useStake(pid)
    // const {onUnstake} = useUnstake(pid)

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
                            <CardIcon>🎁</CardIcon>
                            <Value value={0}/>
                            <Label text={`CAKE prizes to be claimed!`}/>
                        </StyledCardHeader>
                        <StyledCardActions>
                            {!account && <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet"/>}
                            {account && <Button onClick={null} size="md" text="Claim prizes"/>}
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

export default Prize
