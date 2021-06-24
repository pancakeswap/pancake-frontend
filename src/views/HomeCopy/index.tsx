import React from 'react';
import PageHeader from 'components/PageHeader';
import { Heading } from '@rug-zombie-libs/uikit';
import { useWeb3React } from '@web3-react/core';
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './HomeCopy.Styles.css'
import { getDrFrankensteinContract } from '../../utils/contractHelpers'
import { useDrFrankenstein } from '../../hooks/useContract'
import useWeb3 from '../../hooks/useWeb3'
import tableData from './data';

let web3;
let accountAddress;


  

const HomeC: React.FC = () => {

  const { account } = useWeb3React()
  accountAddress = account
  const drFrankenstein = useDrFrankenstein()
  if(accountAddress){
    drFrankenstein.methods.userInfo(0, accountAddress).call()
    .then(res => {
      console.log(res)
    })
  }

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

export default HomeC
