import React, { useEffect, lazy } from 'react'
import { Redirect, Route, useLocation, useParams, useRouteMatch } from 'react-router'
import { useAppDispatch } from 'state'
import { useCollectionFromSlug } from 'state/nftMarket/hooks'
import { fetchCollection } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import Header from './Header'
import BaseSubMenu from '../components/BaseSubMenu'

const Items = lazy(() => import('./Items'))
const Traits = lazy(() => import('./Traits'))

const Collection = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const { path } = useRouteMatch()
  const collection = useCollectionFromSlug(slug)
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const { address } = collection || {}

  const itemsConfig = [
    {
      label: t('Items'),
      href: `/nft/market/collections/${slug}`,
    },
    {
      label: t('Traits'),
      href: `/nft/market/collections/${slug}/traits`,
    },
  ]

  useEffect(() => {
    if (address) {
      dispatch(fetchCollection(address))
    }
  }, [address, dispatch])

  if (!slug || !collection) {
    return <Redirect to="/404" />
  }

  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'lowestTokenPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <>
      <Header collection={collection} />
      <Container>
        <BaseSubMenu items={itemsConfig} activeItem={pathname} mt="24px" mb="8px" />
      </Container>
      <Route exact path={path}>
        <Items collection={collection} />
      </Route>
      <Route path={`${path}/traits`}>
        <Traits collection={collection} />
      </Route>
    </>
  )
}

export default Collection
