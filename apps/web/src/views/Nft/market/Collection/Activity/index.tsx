import { useRouter } from 'next/router'
import { useGetCollection } from 'state/nftMarket/hooks'
import ActivityHistory from '../../ActivityHistory/ActivityHistory'

const Activity = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const collection = useGetCollection(collectionAddress)

  return (
    <>
      <ActivityHistory collection={collection} />
    </>
  )
}

export default Activity
