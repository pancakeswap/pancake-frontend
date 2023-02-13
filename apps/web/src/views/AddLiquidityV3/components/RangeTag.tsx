import { Tag } from '@pancakeswap/uikit'

export default function RangeTag({ removed, outOfRange }) {
  return removed ? (
    <Tag ml="8px" variant="failure" outline>
      Closed
    </Tag>
  ) : outOfRange ? (
    <Tag ml="8px" variant="textSubtle" outline>
      Out of range
    </Tag>
  ) : (
    <Tag ml="8px" variant="success" outline>
      In range
    </Tag>
  )
}
