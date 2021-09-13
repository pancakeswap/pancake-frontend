import React from 'react'
import { random } from 'lodash'
import { Link } from 'react-router-dom'
import { MinMaxFilter, ListFilter } from 'components/Filters'
import Page from 'components/Layout/Page'
import { Item } from 'components/Filters/ListFilter/styles'

const exampleList: Item[] = [
  { image: '/images/collections/pancake-bunnies-avatar.png', label: 'Collection Name', count: random(1, 50) },
  { label: 'Smiley', count: random(1, 50) },
  { label: 'Big', count: random(1, 50) },
  { label: 'Teeth', count: random(1, 50) },
  { label: 'Cigar', count: random(1, 50) },
  { label: 'Lollipop', count: random(1, 50) },
  { label: 'Ears', count: random(1, 50) },
  { label: 'Glasses', count: random(1, 50) },
  { label: 'Frown', count: random(1, 50) },
  { label: 'Zombie', count: random(1, 50) },
  { label: 'Bazooka', count: random(1, 50) },
]

const Collectible = () => {
  const handleApply = (min: number, max: number) => {
    console.log(min, max)
  }

  const handleListApply = (items: Item[]) => {
    console.log(items)
  }

  return (
    <>
      <Page>
        <Link to="/nft/market/collectibles/pancake-squad">Pancake Bunnies</Link>
        <MinMaxFilter title="Price" min={1} max={100} onApply={handleApply} />
        <ListFilter title="Attribute" items={exampleList} onApply={handleListApply} />
      </Page>
    </>
  )
}

export default Collectible
