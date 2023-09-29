import { Tag, UnlockIcon } from '@pancakeswap/uikit'
import { CSSProperties, ReactNode } from 'react'

export function UnlockedFixedTag({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <Tag
      style={style}
      outline
      variant="secondary"
      startIcon={<UnlockIcon style={{ marginRight: '0px' }} width="18px" color="secondary" />}
    >
      {children}
    </Tag>
  )
}
