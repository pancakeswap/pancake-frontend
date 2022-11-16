import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export default function AdvancedSwapDetailsDropdown({ tradeData, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(tradeData)

  return (
    <AdvancedDetailsFooter show={Boolean(tradeData)}>
      <AdvancedSwapDetails {...rest} tradeData={tradeData ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
