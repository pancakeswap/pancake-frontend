import { Tag, TagProps } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

export function RangeTag({
  removed,
  outOfRange,
  children,
  ...props
}: { removed?: boolean; outOfRange: boolean; children?: ReactNode } & TagProps) {
  return removed ? (
    <Tag ml="8px" variant="textSubtle" {...props}>
      {children || 'Closed'}
    </Tag>
  ) : outOfRange ? (
    <Tag ml="8px" variant="failure" {...props}>
      {children || 'Inactive'}
    </Tag>
  ) : (
    <Tag ml="8px" variant="success" {...props}>
      {children || 'Active'}
    </Tag>
  )
}
