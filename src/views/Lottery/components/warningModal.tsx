import React, {useCallback} from 'react'
import Button from '../../../components/Button'
import Modal, {ModalProps} from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import styled from "styled-components";
import ModalContent from "../../../components/ModalContent";
import {useWinningNumbers} from '../../../hooks/useTickets'

interface WarningModalProps extends ModalProps {
  title: string,
  text?: string,
}

const WarningModal: React.FC <WarningModalProps> = ({ title, text, onDismiss}) => {

    return (
        <Modal>
            <ModalTitle text={'Warning'}/>
            <ModalContent>
                <div>
                    <TicketsList>
                      Lottery ticket purchases are <b>final</b>.
                      <br />
                      Your CAKE will not be returned to you after you spend it to buy tickets.
                      <br />Tickets are only valid for one lottery draw, and will be burned after the draw.
                      <br />Buying tickets does not guarantee you will win anything. Please only participate once you understand the risks.
                    </TicketsList>
                </div>
            </ModalContent>
            <ModalActions>
                <Button text="I understand" variant="secondary" onClick={onDismiss}/>
            </ModalActions>
        </Modal>
    )
}

const RewardP = styled.div`
  color: #ff8c28;
`


const TicketsList = styled.div`
  text-align: left;
  overflow-y: auto;
  max-height: 400px;
  color: ${(props) => props.theme.colors.primary};
`

export default WarningModal
