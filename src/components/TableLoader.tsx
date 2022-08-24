import styled from 'styled-components'
import { Flex, Skeleton, Td, useMatchBreakpoints } from '@pancakeswap/uikit'

const GridItem = styled(Flex)`
  align-items: center;
`

const LoadingRow: React.FC<React.PropsWithChildren> = () => {
  const { isXs, isSm } = useMatchBreakpoints()

  return (
    <tr>
      <Td>
        <GridItem>
          <Skeleton height={[162, null, 64]} width={[80, null, 200]} />
        </GridItem>
      </Td>
      <Td>
        <GridItem justifyContent="flex-end">
          <Skeleton height={[66, null, 24]} width={64} />
        </GridItem>
      </Td>
      {isXs || isSm ? null : (
        <>
          <Td>
            <GridItem justifyContent="flex-end">
              <Skeleton height={42} width={64} />
            </GridItem>
          </Td>
          <Td>
            <GridItem justifyContent="flex-end">
              <Skeleton height={48} width={124} />
            </GridItem>
          </Td>
        </>
      )}
      <Td>
        <GridItem justifyContent="center">
          <Skeleton height={[36, null, 24]} width={[80, null, 120]} />
        </GridItem>
      </Td>
    </tr>
  )
}

const TableLoader: React.FC<React.PropsWithChildren> = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)

export default TableLoader
