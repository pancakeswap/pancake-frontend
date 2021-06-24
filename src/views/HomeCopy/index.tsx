import React, { useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import { Heading } from '@rug-zombie-libs/uikit';
import { useWeb3React } from '@web3-react/core';
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import tokens from 'config/constants/tokens';
import { useIfoAllowance } from 'hooks/useAllowance';
import { getDrFrankensteinContract } from '../../utils/contractHelpers';
import { useDrFrankenstein, useERC20 } from '../../hooks/useContract'
import useWeb3 from '../../hooks/useWeb3'
import tableData from './data';
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './HomeCopy.Styles.css'



let web3;
let accountAddress;


  

const HomeC: React.FC = () => {

  const { account } = useWeb3React()
  accountAddress = account
  const drFrankenstein = useDrFrankenstein();
  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const allowance = useIfoAllowance(zmbeContract, getDrFrankensteinAddress());

  // if allowance === 0 show the approve zombie don't call drFrankenstain
  // if allowance > 0 if(grave) paidUnlockFee === true amount 

  useEffect(()=>{
    if(accountAddress){
      drFrankenstein.methods.userInfo(0, accountAddress).call()
      .then(res => {
        console.log(res)
      })
    }
  }, [drFrankenstein.methods])
  

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
