import { Skeleton } from '@pancakeswap/uikit'
import { Container } from './styled'

export const PositionItemSkeleton = () => {
  return (
    <Container>
      <Skeleton width={48} height={48} variant="circle" />
      <div>
        <Skeleton width={40} height={10} mb="4px" />
        <Skeleton width={60} height={24} />
      </div>
    </Container>
  )
}
