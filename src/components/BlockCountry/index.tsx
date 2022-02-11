import * as React from 'react'
import { useModal } from '@tovaswapui/uikit'
import Cookies from 'js-cookie'
import { BLOCK_COUNTRIES_COOKIE_NAME } from 'config/constants/cookie-names'
import BlockCountryModal from './BlockCountryModal'

function BlockCountry() {
  const [showModal] = useModal(<BlockCountryModal />, false)
  const showModalRef = React.useRef(showModal)

  React.useEffect(() => {
    const isBlockCountry = Cookies.get(BLOCK_COUNTRIES_COOKIE_NAME)

    if (isBlockCountry) {
      showModalRef.current()
    }
  }, [showModalRef])

  return null
}

export default BlockCountry
