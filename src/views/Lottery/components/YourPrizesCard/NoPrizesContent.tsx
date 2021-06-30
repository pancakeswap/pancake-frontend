import React from 'react'
import styled from 'styled-components'
import { Text, Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTickets from 'views/Lottery/hooks/useTickets'
import MyTicketsModal from '../TicketCard/UserTicketsModal'

const Wrapper = styled.div`
  display: flex;
`

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledText = styled(Text)`
  padding-left: 12px;
`

const Image = styled.img`
  margin-right: 6px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 20px;
  }
`
const StyledButton = styled(Button)`
  padding: 0 12px;
  height: unset;
`

const NoPrizesContent: React.FC = () => {
  const { t } = useTranslation()
  const tickets = useTickets()
  const [onPresentMyTickets] = useModal(<MyTicketsModal myTicketNumbers={tickets} from="buy" />)

  return (
    <Wrapper>
      <Image src="/images/no-prize.svg" alt="no prizes won" />
      <TextWrapper>
        <StyledText color="textDisabled">{t('Sorry, no prizes to collect')}</StyledText>
        <StyledButton variant="text" onClick={onPresentMyTickets}>
          {t('View your tickets')}
        </StyledButton>
      </TextWrapper>
    </Wrapper>
  )
}

export default NoPrizesContent
