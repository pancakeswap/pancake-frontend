import styled from 'styled-components'

const Card = styled.div<{ isActive?: boolean; isFinished?: boolean }>`
  background: ${(props) => props.theme.colors.card.background};
  border-radius: 32px;
  display: flex;
  color: ${({ isFinished, theme }) =>
    theme.colors[isFinished ? 'textDisabled2' : 'secondary2']};
  flex-direction: column;
  position: relative;
`

export default Card
