import styled from 'styled-components'

export const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin: auto;
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.4);

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`
