import React from 'react'
import PageHeader from 'components/PageHeader'
import { Heading } from '@rug-zombie-libs/uikit'
import Page from '../../components/layout/Page'
import Table from '../HomeCopy/components/Table'
import '../HomeCopy/HomeCopy.Styles.css'
import { tableData } from '../HomeCopy/data'

const Tombs: React.FC = () => {
  return (
    <Page className="innnerContainer">
      <PageHeader className="innerHeader">
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          Tombs
        </Heading>
        <Heading scale="lg" color="text">
          Stake Liquidity Pool (LP) tokens to earn.
        </Heading>
      </PageHeader>
      <div>
        {tableData.map((data) => {
          return <Table details={data} key={data.id} />
        })}
      </div>
    </Page>
  )
}

export default Tombs;
