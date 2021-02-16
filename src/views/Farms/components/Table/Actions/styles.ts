import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 1rem;
  border: 2px solid #eeeaf4;
  border-radius: 1rem;
  flex-grow: 1;
  flex-basis: 0;
  margin-left: 48px;
`

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 8px;
`

export const Title = styled.span`
  color: ${(props) => props.theme.colors.secondary};
`

export const Subtle = styled.span`
  color: ${(props) => props.theme.colors.textSubtle};
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export const Earned = styled.div`
  font-weight: 600;
  font-size: 1.25rem;
`

export const Staked = styled.div`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.textSubtle};
`