import styled from 'styled-components'

interface IfoCardLayoutProps {
  isSingle?: boolean
}

const IfoCardLayout = styled.div<IfoCardLayoutProps>`
  align-items: start;
  border-top: 2px solid ${({ theme }) => theme.colors.textSubtle};
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 32px;
  padding-bottom: 40px;
  padding-top: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: ${({ isSingle }) => `repeat(${isSingle ? 1 : 2}, 1fr)`};
  }
`

IfoCardLayout.defaultProps = {
  isSingle: false,
}

export default IfoCardLayout
