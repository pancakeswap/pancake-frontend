import { useRouter } from 'next/router'

export default function PoolItem() {
  const router = useRouter()

  const { poolId } = router.query

  return <>Pool Item {poolId}</>
}
