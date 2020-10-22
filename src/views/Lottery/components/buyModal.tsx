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

import useBuyLottery, { useMultiBuyLottery, useMaxNumber } from '../../../hooks/useBuyLottery'

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
    const [val, setVal] = useState('1')
    const [pendingTx, setPendingTx] = useState(false)
    const [requesteBuy, setRequestedBuy] = useState(false)

    const fullBalance = useMemo(() => {
        return getFullDisplayBalance(max)
    }, [max])

    const maxTickets = useMemo(() => {
        return parseInt(getFullDisplayBalance(max.div(new BigNumber(10))))
    }, [max])

    const handleChange = useCallback(
        async (e: React.FormEvent<HTMLInputElement>) => {
            await setVal(e.currentTarget.value)
        },
        [setVal, val],
    )

    const { onMultiBuy } = useMultiBuyLottery()
    const maxNumber  = useMaxNumber()

    const handleBuy = useCallback(async () => {
      try {
        setRequestedBuy(true)
        const length = parseInt(val)

        console.log(maxNumber)
        // @ts-ignore
        const numbers = Array.apply(null, { length }).map(() => ([
          Math.floor(Math.random() * maxNumber) + 1,
          Math.floor(Math.random() * maxNumber) + 1,
          Math.floor(Math.random() * maxNumber) + 1,
          Math.floor(Math.random() * maxNumber) + 1
        ]));
        console.log(numbers)
        const txHash = await onMultiBuy('1', numbers)
        // user rejected tx or didn't go thru
        if (txHash) {
          setRequestedBuy(false)
        }
      } catch (e) {
        console.log(e)
      }
    }, [onMultiBuy, setRequestedBuy, maxNumber, val])

    const handleSelectMax = useCallback(() => {
      if(Number(maxTickets) > 50) {
        setVal('50')
      }
      else {
        setVal(maxTickets.toString())
      }
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
                    disabled={pendingTx || parseInt(val) > Number(maxTickets) || parseInt(val) > 50 || parseInt(val) < 1}
                    text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
                    onClick={async () => {
                        setPendingTx(true)
                        await handleBuy()
                        setPendingTx(false)
                        onDismiss()
                    }}
                />
            </ModalActions>
        </Modal>
    )
}

export default BuyModal

const Tips = styled.div`
  margin-left: 0.4em;
  font-size: 14px;
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
