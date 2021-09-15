import React from 'react'
import { Box } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import Page from 'components/Layout/Page'
import FilterContainer from '../components/FilterContainer'

const exampleList = [
  { label: 'Smiley', value: 1 },
  { label: 'Big', value: 1 },
  { label: 'Teeth', value: 1 },
  { label: 'Cigar', value: 1 },
  { label: 'Lollipop', value: 1 },
  { label: 'Ears', value: 1 },
  { label: 'Glasses', value: 1 },
  { label: 'Frown', value: 1 },
  { label: 'Zombie', value: 1 },
  { label: 'Bazooka', value: 1 },
  { label: 'Smiley', value: 1 },
  { label: 'Big', value: 1 },
  { label: 'Teeth', value: 1 },
  { label: 'Cigar', value: 1 },
  { label: 'Lollipop', value: 1 },
  { label: 'Ears', value: 1 },
  { label: 'Glasses', value: 1 },
  { label: 'Frown', value: 1 },
  { label: 'Zombie', value: 1 },
  { label: 'Bazooka', value: 1 },
]

const Collectible = () => {
  return (
    <>
      <Page>
        <Link to="/nft/market/collectibles/pancake-bunnies">Pancake Bunnies</Link>
        <Link to="/nft/market/collectibles/pancake-squad">Pancake Bunnies</Link>

        <Box py="40px">
          <FilterContainer items={exampleList} onFilterClick={(item) => console.log(item)} />
        </Box>
      </Page>
    </>
  )
}

export default Collectible
