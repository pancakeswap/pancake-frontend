import { PropsWithChildren } from 'react'
import { AutoColumn } from '@pancakeswap/uikit'

import { Wrapper } from '../../components/styleds'

export function FormContainer({ children }: PropsWithChildren) {
  return (
    <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
      <AutoColumn gap="sm">{children}</AutoColumn>
    </Wrapper>
  )
}
