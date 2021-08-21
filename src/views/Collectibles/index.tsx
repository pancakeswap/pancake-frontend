/* eslint-disable no-param-reassign */
import React from 'react'
import PageHeader from 'components/PageHeader'
import { Flex, Heading } from '@rug-zombie-libs/uikit'
import Collectibles from './components/Collectibles';

const CollectiblesMain: React.FC = () => {
  
  return (
    <>
      <PageHeader background="#101820">
        <Flex justifyContent='space-between' className="border-bottom" flexDirection={['column', null, 'row']}>
          <Flex flexDirection='column' mr={['8px', 0]}>
            <Heading as='h1' size='xxl' color='secondary' mb='24px'>
              Rug Zombie Collectibles
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      <div>
        HI
        <Collectibles />
      </div>
    </>
  )
}

export default CollectiblesMain
