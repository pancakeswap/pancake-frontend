import BigNumber from 'bignumber.js'
import React, {useCallback, useMemo, useState} from 'react'
import Button from '../../../components/Button'
import Modal, {ModalProps} from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import {getFullDisplayBalance} from '../../../utils/formatBalance'
import styled from "styled-components";
import TicketInput from "../../../components/TicketInput";

import useBuyLottery, { useMultiBuyLottery } from '../../../hooks/useBuyLottery'

interface BuyModalProps extends ModalProps {
    max: BigNumber
    onConfirm: (amount: string, numbers: Array<number>) => void
    tokenName?: string
}

const BuyModal: React.FC<BuyModalProps> = ({
                                                   max,
                                                   onConfirm,
                                                   onDismiss,
                                                   tokenName = '',
                                               }) => {
    const [val, setVal] = useState('')
    const [pendingTx, setPendingTx] = useState(false)
    const [requesteBuy, setRequestedBuy] = useState(false)

    const fullBalance = useMemo(() => {
        return getFullDisplayBalance(max)
    }, [max])

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setVal(e.currentTarget.value)
        },
        [setVal],
    )

    const { onMultiBuy } = useMultiBuyLottery()

    const handleBuy = useCallback(async () => {
      try {
        console.log('ddd')
        setRequestedBuy(true)
        const txHash = await onMultiBuy('5', [3,5,1,4])
        // user rejected tx or didn't go thru
        if (txHash) {
          setRequestedBuy(false)
        }
      } catch (e) {
        console.log(e)
      }
    }, [onMultiBuy, setRequestedBuy])

    const handleSelectMax = useCallback(() => {
        setVal(fullBalance)
    }, [fullBalance, setVal])

    const cakeCosts = (amount: string): number => {
        return +amount * 10;
    }
    return (
        <Modal>
            <ModalTitle text={`Enter amount of tickets to buy`}/>
            <TicketInput
                value={val}
                onSelectMax={handleSelectMax}
                onChange={handleChange}
                max={fullBalance}
                symbol={'TICKET'}
                availableSymbol={'CAKE'}
            />
            <div>
                <Tips>Your amount must be a multiple of 10 CAKE</Tips>
                <Tips>1 Ticket = 10 CAKE</Tips>
            </div>
            <div>
                <Final>You will spend: {cakeCosts(val)} CAKE</Final>
            </div>
            <ModalActions>
                <Button text="Cancel" variant="secondary" onClick={onDismiss}/>
                <Button
                    disabled={pendingTx}
                    text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
                    onClick={async () => {
                        setPendingTx(true)
                        await handleBuy()
                        setPendingTx(false)
                        {/*onDismiss()*/}
                    }}
                />
            </ModalActions>
        </Modal>
    )
}

export default BuyModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.grey[400]};
`

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`
