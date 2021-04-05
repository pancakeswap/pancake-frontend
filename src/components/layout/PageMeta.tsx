import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { customMeta, DEFAULT_META } from 'config/constants/meta'
import { usePriceCakeBusd } from 'state/hooks'

const PageMeta = () => {
  const { pathname } = useLocation()
  const cakePriceUsd = usePriceCakeBusd()
  const cakePriceUsdDisplay =
    cakePriceUsd.gt(0) &&
    `$${cakePriceUsd.toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`
  const pageMeta = customMeta[pathname] || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  const titleWithPrice = [title, cakePriceUsdDisplay].join(' - ')

  return (
    <Helmet>
      <title>{titleWithPrice}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  )
}

export default PageMeta
