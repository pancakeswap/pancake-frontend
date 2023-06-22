import { PropsWithChildren, memo } from 'react'
import { Column } from '@pancakeswap/uikit'

import { Wrapper } from './styled'

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page">
      <Column gap="lg" pl="8px" pr="8px" pb="8px" pt="0px">
        {children}
      </Column>
    </Wrapper>
  )
})
