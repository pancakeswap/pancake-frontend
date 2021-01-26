import React from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Image, Card, CardBody } from '@pancakeswap-libs/uikit'
import { useWinningNumbers, useMatchingRewardLength } from 'hooks/useTickets'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'

const WinningNumbers: React.FC = () => {
  const { account } = useWallet()
  const winNumbers = useWinningNumbers()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const MatchedNumber4 = useMatchingRewardLength(4)
  const MatchedNumber3 = useMatchingRewardLength(3)
  const MatchedNumber2 = useMatchingRewardLength(2)
  const TranslateString = useI18n()

  return (
    <CardWrapper>
      <Card>
        <CardBody>
          <StyledCardContentInner>
            <StyledCardHeader>
              <Title>
                {account && lotteryHasDrawn
                  ? `🥳${TranslateString(570, 'Winning Numbers This Round')}🥳`
                  : TranslateString(572, 'Latest Winning Numbers')}
              </Title>
              <br />
            </StyledCardHeader>
            <Row>
              {winNumbers.map((number, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <TicketNumberBox key={index}>
                  <CenteredText>{number}</CenteredText>
                </TicketNumberBox>
              ))}
            </Row>
            <RabbitRow>
              <RabbitBox>
                <CardImageFirst>
                  <Image src="/images/sign bunny 1@2x.png" alt="Number 1" width={200} height={150} responsive />
                </CardImageFirst>
              </RabbitBox>
              <RabbitBox>
                <CardImage style={{ marginLeft: '-1.2em' }}>
                  <Image src="/images/sign bunny 2@2x.png" alt="Number 2" width={200} height={150} responsive />
                </CardImage>
              </RabbitBox>
              <RabbitBox>
                <CardImage style={{ marginLeft: '-1.2em' }}>
                  <Image src="/images/sign bunny 3@2x.png" alt="Number 3" width={200} height={150} responsive />
                </CardImage>
              </RabbitBox>
              <RabbitBox>
                <CardImage style={{ marginLeft: '-1.2em' }}>
                  <Image src="/images/sign bunny 4@2x.png" alt="Number 4" width={200} height={150} responsive />
                </CardImage>
              </RabbitBox>
            </RabbitRow>
            <RabbitRowSmall>
              <RabbitBoxSmall>
                <CardImageFirst>
                  <Image src="/images/sign bunny 1@2x.png" alt="Number 1" width={200} height={150} responsive />
                </CardImageFirst>
              </RabbitBoxSmall>
              <RabbitBoxSmall>
                <CardImage style={{ marginLeft: '-1.2em' }}>
                  <Image src="/images/sign bunny 2@2x.png" alt="Number 2" width={200} height={150} responsive />
                </CardImage>
              </RabbitBoxSmall>
              <RabbitBoxSmall>
                <CardImage style={{ marginLeft: '-1.2em' }}>
                  <Image src="/images/sign bunny 3@2x.png" alt="Number 3" width={200} height={150} responsive />
                </CardImage>
              </RabbitBoxSmall>
              <RabbitBoxSmall>
                <CardImage style={{ marginLeft: '-1.2em' }}>
                  <Image src="/images/sign bunny 4@2x.png" alt="Number 4" width={200} height={150} responsive />
                </CardImage>
              </RabbitBoxSmall>
            </RabbitRowSmall>
            <Column>
              <RowNoPadding>
                <CenteredTextWithPadding>{TranslateString(442, 'Tickets matching 4 numbers:')}</CenteredTextWithPadding>
                <CenteredTextWithPadding>
                  <strong>{MatchedNumber4}</strong>
                </CenteredTextWithPadding>
              </RowNoPadding>
              <RowNoPadding>
                <CenteredTextWithPadding>{TranslateString(444, 'Tickets matching 3 numbers:')}</CenteredTextWithPadding>
                <CenteredTextWithPadding>
                  <strong>{MatchedNumber3}</strong>
                </CenteredTextWithPadding>
              </RowNoPadding>
              <RowNoPadding>
                <CenteredTextWithPadding>{TranslateString(446, 'Tickets matching 2 numbers:')}</CenteredTextWithPadding>
                <CenteredTextWithPadding>
                  <strong>{MatchedNumber2}</strong>
                </CenteredTextWithPadding>
              </RowNoPadding>
            </Column>
            <Link href="https://api.pancakeswap.com/api/lottery?page=0&pageSize=25" target="_blank">
              {TranslateString(448, 'Export recent winning numbers')}
            </Link>
          </StyledCardContentInner>
        </CardBody>
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

const RabbitRow = styled.div`
  margin-top: -2.3em;
  align-items: center;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    display: none;
  }
`

const RabbitRowSmall = styled.div`
  margin-top: -2.3em;
  align-items: center;
  display: flex;
  flex-direction: row;

  @media (min-width: 768px) {
    display: none;
  }
`

const CardImage = styled.div`
  text-align: center;
`

const CardImageFirst = styled.div`
  text-align: center;
  margin-left: -1.2em;

  @media (max-width: 600) {
    margin-left: -0.2em;
  }
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
  background: linear-gradient(180deg, #54dade 0%, #24c7d6 76.22%);
  color: white;
  font-size: 20px;
  font-weight: 900;
  margin: 10px;
  margin-bottom: 7px;
  width: 40px;

  @media (min-width: 768px) {
    font-size: 40px;
    margin: 20px;
    width: 60px;
  }
`

const RabbitBox = styled.div`
  /* padding: 10px; */
  border-radius: 12px;
  margin: 16px 20px;
  width: 60px;
`

const RabbitBoxSmall = styled.div`
  padding-top: 10px;
  padding-left: 10px;
  border-radius: 12px;
  margin: 20px;
  width: 20px;
`

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const CardWrapper = styled.div``

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 24px;
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

export default WinningNumbers
