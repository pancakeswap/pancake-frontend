import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import IconButton from '../../../components/IconButton'
import { AddIcon } from '../../../components/icons'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'
import {useMultiClaimLottery} from '../../../hooks/useBuyLottery'

import {useTotalClaim} from '../../../hooks/useTickets'
import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'
import { TranslateString } from '../../../utils/translateTextHelpers'

interface PrizeProps {
  status: boolean
}

const Prize: React.FC<PrizeProps> = ({status}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requesteClaim, setRequestedClaim] = useState(false)
  const { account } = useWallet()

  // const allowance = useAllowance(lpContract)
  // const {onApprove} = useApprove(lpContract)
  //
  // const tokenBalance = useTokenBalance(lpContract.options.address)
  // const stakedBalance = useStakedBalance(pid)
  //
  // const {onStake} = useStake(pid)
  // const {onUnstake} = useUnstake(pid)
  const claimAmount = useTotalClaim()

  const { onMultiClaim } = useMultiClaimLottery()

  const handleClaim = useCallback(async () => {
    try {
      setRequestedClaim(true)
      const txHash = await onMultiClaim()
      // user rejected tx or didn't go thru
      if (txHash) {
        setRequestedClaim(false)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onMultiClaim, setRequestedClaim])

  const [onPresentAccountModal] = useModal(<AccountModal />)

  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
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
                          <Value value={getBalanceNumber(claimAmount)}/>
                          <Label text={`CAKE prizes to be claimed!`}/>
                      </StyledCardHeader>
                      <StyledCardActions>
                          {!account && <Button onClick={handleUnlockClick} size="md" text="Unlock Wallet"/>}
                          {account && <Button disabled={!status || getBalanceNumber(claimAmount) == 0 || requesteClaim} onClick={handleClaim} size="md" text="Claim prizes"/>}
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
