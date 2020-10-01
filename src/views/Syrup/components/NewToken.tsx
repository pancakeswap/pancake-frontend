import React, {useState, useCallback} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import {useSousEarnings, useSousLeftBlocks} from '../../../hooks/useEarnings'
import useSushi from '../../../hooks/useSushi'
import useTokenBalance from '../../../hooks/useTokenBalance'

import {getDisplayBalance2} from '../../../utils/formatBalance'
import {getSyrupAddress} from '../../../sushi/utils'
import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'

interface TokenRewardProps {
    tokenName: string
}


const TokenReward: React.FC<TokenRewardProps> = ({tokenName}) => {
    const earnings = useSousEarnings()
    const {account} = useWallet()
    const leftBlockText = useSousLeftBlocks()
    const [pendingTx, setPendingTx] = useState(false)


    const [onPresentAccountModal] = useModal(<AccountModal/>)
    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal/>,
        'provider',
    )
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    return (
        <Card>
            <CardContent>
                <StyledCardContentInner>
                    <StyledCardHeader>
                        <CardIcon>🪂</CardIcon>
                        <Value value={getDisplayBalance2(earnings)}/>
                        <Label text={`${tokenName} Tokens Earned`}/>
                    </StyledCardHeader>
                    <StyledCardActions>
                        {!account && <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet"/>}
                        {account && <Hint>{leftBlockText}</Hint>}
                    </StyledCardActions>
                </StyledCardContentInner>
            </CardContent>
        </Card>
    )
}

const Hint = styled.div`
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  @media (max-width: 550px) {
    font-size: 14px;
  }
`

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

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
`

export default TokenReward
