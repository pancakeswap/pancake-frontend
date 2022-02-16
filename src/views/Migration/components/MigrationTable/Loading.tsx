import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import Loading from 'components/Loading'

const TableLoading = () => {
  return (
    <tr>
      <td>
        <Flex padding="24px" justifyContent="center">
          <Loading />
        </Flex>
      </td>
    </tr>
  )
}

export default TableLoading
