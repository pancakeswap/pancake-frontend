import { memo, PropsWithChildren } from 'react'
import { Card, CardBody } from '@pancakeswap/uikit'
import styled from 'styled-components'

const LightGreyCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const InnerCardBody = styled(CardBody)`
  padding: 1em;
  background-color: ${({ theme }) => theme.colors.background};
`

// Card within a card container
export const InnerCard = memo(function InnerCard({ children }: PropsWithChildren<unknown>) {
  return (
    <LightGreyCard mt="1.5em">
      <InnerCardBody>{children}</InnerCardBody>
    </LightGreyCard>
  )
})
