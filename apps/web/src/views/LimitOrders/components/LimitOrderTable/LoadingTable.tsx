import { memo } from 'react'
import { Skeleton, Table, Td } from '@pancakeswap/uikit'

const LoadingTable = () => (
  <Table>
    <tbody>
      <tr>
        <Td>
          <Skeleton />
        </Td>
        <Td>
          <Skeleton />
        </Td>
        <Td>
          <Skeleton />
        </Td>
      </tr>
      <tr>
        <Td>
          <Skeleton />
        </Td>
        <Td>
          <Skeleton />
        </Td>
        <Td>
          <Skeleton />
        </Td>
      </tr>
      <tr>
        <Td>
          <Skeleton />
        </Td>
        <Td>
          <Skeleton />
        </Td>
        <Td>
          <Skeleton />
        </Td>
      </tr>
    </tbody>
  </Table>
)

export default memo(LoadingTable)
