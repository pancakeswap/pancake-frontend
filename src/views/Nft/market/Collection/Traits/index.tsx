import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import CollapsibleCard from 'components/CollapsibleCard'
import { Table, Td, Th } from '@pancakeswap/uikit'
import { useAppDispatch } from 'state'
import { useGetCollection } from 'state/nftMarket/hooks'
import { fetchCollection } from 'state/nftMarket/reducer'
import { useTranslation } from 'contexts/Localization'
import Header from '../Header'

const Traits = () => {
  const { collectionAddress } = useParams<{ collectionAddress: string }>()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const collection = useGetCollection(collectionAddress)
  const { address } = collection || {}

  useEffect(() => {
    if (address) {
      dispatch(fetchCollection(address))
    }
  }, [address, dispatch])

  return (
    <>
      <Header collection={collection} />
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
    </>
  )
}

export default Traits
