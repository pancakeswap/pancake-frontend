import { useRouter } from 'next/router'
import { useEffect } from 'react'

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/swap')
  }, [router])
  return <></>
}

export default IndexPage
