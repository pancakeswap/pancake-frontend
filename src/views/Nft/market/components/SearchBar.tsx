import React from 'react'
import AddressInputSelect from 'components/AddressInputSelect'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { useRouter } from 'next/router'

const SearchBar: React.FC = (props) => {
  const router = useRouter()

  const handleAddressClick = (value: string) => {
    router.push(`${nftsBaseUrl}/profile/${value}`)
  }

  return <AddressInputSelect onAddressClick={handleAddressClick} {...props} />
}

export default SearchBar
