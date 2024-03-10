import { useEffect } from 'react'
import { useRouter } from 'next/router'

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/swap')
  }, [router])
  return <></>
}

export default IndexPage
