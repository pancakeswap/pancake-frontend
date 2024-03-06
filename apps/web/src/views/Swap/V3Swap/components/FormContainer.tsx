import { PropsWithChildren, memo } from 'react'
import { Column } from '@pancakeswap/uikit'

import { Wrapper } from '../../components/styleds'

export const FormContainer = memo(function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page" style={{ minHeight: '300px' }}>
      <Column gap="0px">{children}</Column>
    </Wrapper>
  )
})
