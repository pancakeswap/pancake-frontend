import React from 'react';
import PageHeader from 'components/PageHeader';
import { Heading } from '@rug-zombie-libs/uikit'
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './HomeCopy.Styles.css'
import { tableData } from './data';

const Home: React.FC = () => {

  return (
    <Page className="innnerContainer">
      <PageHeader background="none">
        <Heading color="secondary" mb="24px">
          Graves
        </Heading>
        <Heading color="text">
          Stake Liquidity Pool (LP) tokens to earn.
        </Heading>
      </PageHeader>
      <div>
        {tableData.map((data) => {
          return <Table details={data} key={data.id}/>
        })}
      </div>
    </Page>
  )
}

export default Home
