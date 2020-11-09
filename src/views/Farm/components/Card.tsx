import styled from 'styled-components'

// TODO: Replace with UI Kit
const Card = styled.div`
  background: ${(props) => props.theme.card.background};
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  border-radius: 32px;
  padding: 24px;
`

export default Card
