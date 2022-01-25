import React from 'react'
import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedMintDetails, AdvancedMintDetailsProps } from './AdvancedMintDetails'

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

export default function AdvancedMintDetailsDropdown({ mint, ...rest }: AdvancedMintDetailsProps) {
  const lastMint = useLastTruthy(mint)

  return (
    <AdvancedDetailsFooter show={Boolean(mint)}>
      <AdvancedMintDetails {...rest} mint={mint ?? lastMint ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
