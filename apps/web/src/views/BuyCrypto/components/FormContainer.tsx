import { PropsWithChildren, memo } from 'react'
import { Column } from '@pancakeswap/uikit'

import { Wrapper } from './styled'

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page">
      <Column gap="md" padding="8px">
        {children}
      </Column>
    </Wrapper>
  )
})
