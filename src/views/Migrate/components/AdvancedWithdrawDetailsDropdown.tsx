import React from 'react'
import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedWithdrawDetails, AdvancedWithdrawDetailsProps } from './AdvancedWithdrawDetails'

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

export default function AdvancedWithdrawDetailsDropdown({ withdraw, ...rest }: AdvancedWithdrawDetailsProps) {
  const lastWithdraw = useLastTruthy(withdraw)

  return (
    <AdvancedDetailsFooter show={Boolean(withdraw)}>
      <AdvancedWithdrawDetails {...rest} withdraw={withdraw ?? lastWithdraw ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
