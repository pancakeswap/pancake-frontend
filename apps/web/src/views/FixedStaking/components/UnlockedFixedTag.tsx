import { Tag, UnlockIcon } from '@pancakeswap/uikit'

export function UnlockedFixedTag({ children }) {
  return (
    <Tag outline variant="secondary" startIcon={<UnlockIcon width="18px" color="secondary" />}>
      {children}
    </Tag>
  )
}
