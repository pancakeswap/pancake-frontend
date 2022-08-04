import AddressInputSelect from 'components/AddressInputSelect'
import { useRouter } from 'next/router'

const SearchBar: React.FC = (props) => {
  const router = useRouter()

  const handleAddressClick = (value: string) => {
    router.push(`/profile/${value}`)
  }

  return <AddressInputSelect onAddressClick={handleAddressClick} {...props} />
}

export default SearchBar
