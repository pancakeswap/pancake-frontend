import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AkkaAdvancedSwapDetails, AdvancedSwapDetailsProps } from './AkkaAdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  max-width: 400px;
  border-radius: 20 nmj, .px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
  @media (max-width: 768px) {
    margin-bottom: ${({ show }) => (show ? '24px' : 0)};
  }
`

export default function AkkaAdvancedSwapDetailsDropdown({ route, ...rest }: AdvancedSwapDetailsProps) {
  return (
    <AdvancedDetailsFooter show={Boolean(route)}>
      <AkkaAdvancedSwapDetails {...rest} route={route} />
    </AdvancedDetailsFooter>
  )
}
