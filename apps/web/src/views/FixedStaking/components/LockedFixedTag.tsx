import { Tag, LockIcon } from '@pancakeswap/uikit'
import { ReactNode, CSSProperties } from 'react'

export function LockedFixedTag({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <Tag
      style={style}
      variant="secondary"
      startIcon={<LockIcon style={{ marginRight: '0px' }} width="18px" color="white" />}
    >
      {children}
    </Tag>
  )
}
