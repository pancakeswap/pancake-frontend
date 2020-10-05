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
import Page from "../../../components/Page";

interface StakeProps {
    lpContract: Contract
    pid: number
    tokenName: string
}

const Time: React.FC = () => {
    const [requestedApproval, setRequestedApproval] = useState(false)
    const {account} = useWallet()

    const [onPresentAccountModal] = useModal(<AccountModal/>)

    const stateDeadlineTime = '22h, 30m, 10s'
    const stateDeadlineBlocks = '1,301'

    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal/>,
        'provider',
    )
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    return (
        <div>
            <Title style={{marginTop: '2em'}}>⏳</Title>
            <Title>Approx. time left to buy tickets</Title>
            <Title2>{stateDeadlineTime}</Title2>
            <Title2>({stateDeadlineBlocks} blocks)</Title2>
        </div>
    )
}

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size:26px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`

const Title2 = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size:36px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`


export default Time
