import React from 'react'
import PageHeader from 'components/PageHeader'
import { Heading } from '@rug-zombie-libs/uikit'
import { tableData } from 'views/HomeCopy/data'
import Page from '../../components/layout/Page'
import Table from '../HomeCopy/components/Table'
import '../HomeCopy/HomeCopy.Styles.css'

const Tombs: React.FC = () => {
  return (
    <Page className="innnerContainer">
      <PageHeader background="none">
        <Heading color="secondary" mb="24px">
          Tombs
        </Heading>
        <Heading color="text"> 
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
