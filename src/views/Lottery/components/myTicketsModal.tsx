import React, {useCallback} from 'react'
import Button from '../../../components/Button'
import Modal, {ModalProps} from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import styled from "styled-components";
import ModalContent from "../../../components/ModalContent";
import {useWinningNumbers} from '../../../hooks/useTickets'

interface MyTicketsModalProps extends ModalProps {
  myTicketNumbers: Array<any>
}

const MyTicketsModal: React.FC<MyTicketsModalProps> = ({ myTicketNumbers, onDismiss}) => {

    const winNumbers = useWinningNumbers()

    const rewardMatch = useCallback((number) => {
        let n =0
        for (let i = winNumbers.length - 1; i >= 0; i--) {
          if(winNumbers[i] == number[i]) n++
        }
        if(n>1) {
          return true;
        }
        return false;
    }, [winNumbers])


    const listItems = myTicketNumbers.map((number, index) =>
      {
          if(rewardMatch(number[0])) {
              return <RewardP key={index}>🤑🤑{number.toString()}🤑🤑</RewardP>
          }
          else {
              return <p key={index}>{number.toString()}</p>
          }
      }
    );

    return (
        <Modal>
            <ModalTitle text={`My Tickets`}/>
            <ModalContent>
                <div>
                    <TicketsList>
                        <h2>{listItems}</h2>
                    </TicketsList>
                </div>
            </ModalContent>
            <ModalActions>
                <Button text="Close" variant="secondary" onClick={onDismiss}/>
            </ModalActions>
        </Modal>
    )
}

const RewardP = styled.div`
  color: #ff8c28;
`


const TicketsList = styled.div`
  text-align: center;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

export default MyTicketsModal
