import React, {useCallback, useState} from 'react'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import useModal from '../../../hooks/useModal'
import {useWinningNumbers} from '../../../hooks/useTickets'

import WalletProviderModal from '../../../components/WalletProviderModal'
import AccountModal from '../../../components/TopBar/components/AccountModal'
import Button from "../../../components/Button";
import ModalContent from "../../../components/ModalContent";



const Winning: React.FC = () => {
    const [requestedApproval, setRequestedApproval] = useState(false)
    const {account} = useWallet()

    const winNumbers = useWinningNumbers()

    const ending = '2020/05/03 00:00:00 UTC'

    const [onPresentAccountModal] = useModal(<AccountModal/>)

    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal/>,
        'provider',
    )
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    return (
        <CardWrapper style={{marginTop: '4em'}}>
            <Card>
                <CardContent>
                    <StyledCardContentInner>
                        <StyledCardHeader>
                            <Title>Latest Winning Numbers</Title>
                            <br/>
                            <Label text={'Lottery ending ' + ending}></Label>
                        </StyledCardHeader>
                        <Row>
                          {winNumbers.map((number, index) =>
                            <TicketNumberBox key={index}><CenteredText>{number}</CenteredText></TicketNumberBox>
                           )}
                        </Row>
                        <Row style={{marginTop: '-2.3em'}}>
                            <RabbitBox>
                                <CardImage style={{marginLeft: '-1.2em'}}>
                                    <img
                                        src={require(`../../../assets/img/sign bunny 1@2x.png`)}
                                        alt=""
                                        width={100}
                                    />
                                </CardImage>
                            </RabbitBox>
                            <RabbitBox>
                                <CardImage style={{marginLeft: '-1.2em'}}>
                                    <img
                                        src={require(`../../../assets/img/sign bunny 2@2x.png`)}
                                        alt=""
                                        width={100}
                                    />
                                </CardImage>
                            </RabbitBox>
                            <RabbitBox>
                                <CardImage style={{marginLeft: '-1.2em'}}>
                                    <img
                                        src={require(`../../../assets/img/sign bunny 3@2x.png`)}
                                        alt=""
                                        width={100}
                                    />
                                </CardImage>
                            </RabbitBox>
                            <RabbitBox>
                                <CardImage style={{marginLeft: '-1.2em'}}>
                                    <img
                                        src={require(`../../../assets/img/sign bunny 4@2x.png`)}
                                        alt=""
                                        width={100}
                                    />
                                </CardImage>
                            </RabbitBox>
                        </Row>
                        <Column>
                            <RowNoPadding>
                                <CenteredTextWithPadding>Tickets matching 4 numbers:</CenteredTextWithPadding>
                                <CenteredTextWithPadding><strong>2</strong></CenteredTextWithPadding>
                            </RowNoPadding>
                            <RowNoPadding>
                                <CenteredTextWithPadding>Tickets matching 3 numbers:</CenteredTextWithPadding>
                                <CenteredTextWithPadding><strong>5</strong></CenteredTextWithPadding>
                            </RowNoPadding>
                            <RowNoPadding>
                                <CenteredTextWithPadding>Tickets matching 2 numbers:</CenteredTextWithPadding>
                                <CenteredTextWithPadding><strong>12</strong></CenteredTextWithPadding>
                            </RowNoPadding>
                        </Column>
                        <Link href={`https://bscscan.com/address`} target="_blank">Export recent winning numbers</Link>
                    </StyledCardContentInner>
                </CardContent>
            </Card>
        </CardWrapper>
    )
}
const Link = styled.a`
  margin-top: 1em;
  text-decoration: none;
  color: #25beca;
`

const Row = styled.div`
  margin-top: 1em;
  align-items: center;
  display: flex;
  flex-direction: row;
`

const CardImage = styled.div`
  text-align: center;
`

const RowNoPadding = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  margin-top: 1em;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const CenteredText = styled.div`
  text-align: center;
  align-items: center;
`

const CenteredTextWithPadding = styled.div`
  text-align: center;
  align-items: center;
  padding-left: 2px;
  padding-right: 2px;
`

const TicketNumberBox = styled.div`
  padding: 10px;
  border-radius: 12px;
  background: linear-gradient(180deg,#54DADE 0%,#24C7D6 76.22%);
  color: white;
  font-size: 40px;
  font-weight: 900;
  margin: 20px;
  margin-bottom: 7px;
  width: 60px;
`

const RabbitBox = styled.div`
  padding: 10px;
  border-radius: 12px;
  margin: 20px;
  width: 60px;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const CardWrapper = styled.div`
  width: 600px;
  @media (max-width: 1200px) {
    width: 400px;
  }
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

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size:24px;
  width: 50vw;
  text-align: center;
  font-weight: 1000;
`


const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Winning
