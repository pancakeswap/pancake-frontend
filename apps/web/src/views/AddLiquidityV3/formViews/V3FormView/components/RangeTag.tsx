import { Tag } from '@pancakeswap/uikit'

export default function RangeTag({ removed, outOfRange }: { removed?: boolean; outOfRange: boolean }) {
  return removed ? (
    <Tag ml="8px" variant="failure">
      Closed
    </Tag>
  ) : outOfRange ? (
    <Tag ml="8px" variant="textSubtle">
      Inactive
    </Tag>
  ) : (
    <Tag ml="8px" variant="success">
      Active
    </Tag>
  )
}
