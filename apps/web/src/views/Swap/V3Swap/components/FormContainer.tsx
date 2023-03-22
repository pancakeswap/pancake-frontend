import { PropsWithChildren } from 'react'
import { Column } from '@pancakeswap/uikit'

import { Wrapper } from '../../components/styleds'

export function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
      <Column gap="sm">{children}</Column>
    </Wrapper>
  )
}
