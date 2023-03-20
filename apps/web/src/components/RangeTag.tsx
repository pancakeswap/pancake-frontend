import { Tag, TagProps } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

export function RangeTag({
  removed,
  outOfRange,
  children,
  ...props
}: { removed?: boolean; outOfRange: boolean; children?: ReactNode } & TagProps) {
  return removed ? (
    <Tag variant="textSubtle" {...props}>
      {children || 'Closed'}
    </Tag>
  ) : outOfRange ? (
    <Tag variant="failure" {...props}>
      {children || 'Inactive'}
    </Tag>
  ) : (
    <Tag variant="success" {...props}>
      {children || 'Active'}
    </Tag>
  )
}
