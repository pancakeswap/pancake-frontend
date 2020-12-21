import styled from 'styled-components'

// TODO: Use UI Kit
const Grid = styled.div`
  align-items: start;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 16px;

  @media (min-width: 576px) {
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 24px;
  }

  @media (min-width: 852px) {
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 24px;
  }

  @media (min-width: 968px) {
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 32px;
  }

  & > div {
    grid-column: 2 / 8;

    @media (min-width: 576px) {
      grid-column: span 4;
    }
  }
`

export default Grid
