import React from 'react'
import { useHistory } from 'react-router-dom'
import AddressInputSelect from 'components/AddressInputSelect'
import { nftsBaseUrl } from 'views/Nft/market/constants'

const SearchBar: React.FC = (props) => {
  const history = useHistory()

  const handleAddressClick = (value: string) => {
    history.push(`${nftsBaseUrl}/profile/${value}`)
  }

  return <AddressInputSelect onAddressClick={handleAddressClick} {...props} />
}

export default SearchBar
