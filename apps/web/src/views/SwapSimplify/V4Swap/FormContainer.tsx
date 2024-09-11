import { Column } from '@pancakeswap/uikit'
import { PropsWithChildren, memo } from 'react'

import { Wrapper } from '../../Swap/components/styleds'

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page" style={{ minHeight: 'atuo' }}>
      <Column gap="sm">{children}</Column>
    </Wrapper>
  )
})
