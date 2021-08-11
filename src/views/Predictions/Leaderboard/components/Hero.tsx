import React from 'react'
import { Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import Crumbs from './Crumbs'
import AddressSearch from './AddressSearch'

const Hero = () => {
  const { t } = useTranslation()

  return (
    <PageHeader>
      <Crumbs />
      <Flex
        flexDirection={['column', null, null, null, 'row']}
        alignItems={['start', null, null, null, 'center']}
        justifyContent={['start', null, null, null, 'space-between']}
      >
        <Heading as="h1" scale="xxl" color="secondary" mb={['16px', null, null, null, 0]}>
          {t('Leaderboard')}
        </Heading>
        <AddressSearch />
      </Flex>
    </PageHeader>
  )
}

export default Hero
