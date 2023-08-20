import { PropsWithChildren, memo } from 'react'
import { Column } from '@pancakeswap/uikit'
import { Wrapper } from '../styles'

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper>
      <Column gap="lg" pl="8px" pr="8px" pb="8px" pt="0px">
        {children}
      </Column>
    </Wrapper>
  )
})
