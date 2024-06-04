import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'

const ProfilePage = () => {
  const { address: account } = useAccount()
  const router = useRouter()

  useEffect(() => {
    // if (account) {
    //   router.push(`/profile/${account.toLowerCase()}`)
    // }
    // else { // TODO
    //   // router.push(nftsBaseUrl)
    // }
  }, [account, router])

  return null
}

export default ProfilePage
