import React from 'react'
import Button from '../../../components/Button'
import Modal, {ModalProps} from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import styled from "styled-components";
import ModalContent from "../../../components/ModalContent";

const MyTicketsModal: React.FC<ModalProps> = ({onDismiss}) => {
    const myTicketNumbers = ['1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234', '1111', '1234']
    const listItems = myTicketNumbers.map((number) =>
        <p>{number}</p>
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


const TicketsList = styled.div`
  text-align: center;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

export default MyTicketsModal
