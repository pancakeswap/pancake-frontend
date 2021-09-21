import React from 'react'
import { Collection } from 'state/nftMarket/types'
import Page from 'components/Layout/Page'
import CollapsibleCard from 'components/CollapsibleCard'
import { Table, Td, Th } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface TraitsProps {
  collection: Collection
}

const Traits: React.FC<TraitsProps> = ({ collection }) => {
  const { t } = useTranslation()

  return (
    <Page>
      <CollapsibleCard title="Trait">
        <Table>
          <thead>
            <tr>
              <Th textAlign="left">{t('Trait')}</Th>
              <Th>{t('Count')}</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td textAlign="left">trait</Td>
              <Td textAlign="center">23</Td>
            </tr>
          </tbody>
        </Table>
      </CollapsibleCard>
    </Page>
  )
}

export default Traits
