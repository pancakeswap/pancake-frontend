import * as React from 'react'
import { useModal } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import BlockCountryModal from './BlockCountryModal'

function BlockCountry() {
  const [showModal] = useModal(<BlockCountryModal />, false)
  const showModalRef = React.useRef(showModal)
  const router = useRouter()

  React.useEffect(() => {
    const isBlockCountry = router.locale === 'cu'

    if (isBlockCountry) {
      showModalRef.current()
    }
  }, [showModalRef, router.locale])

  return null
}

export default BlockCountry
