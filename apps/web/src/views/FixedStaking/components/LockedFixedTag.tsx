import { Tag, LockIcon } from '@pancakeswap/uikit'

export function LockedFixedTag({ children }) {
  return (
    <Tag variant="secondary" startIcon={<LockIcon width="18px" color="white" />}>
      {children}
    </Tag>
  )
}
