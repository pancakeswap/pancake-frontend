import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import { Heading } from '@rug-zombie-libs/uikit';
import { useWeb3React } from '@web3-react/core';
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import tokens from 'config/constants/tokens';
import { useIfoAllowance } from 'hooks/useAllowance';
import { getDrFrankensteinContract } from '../../utils/contractHelpers';
import { useDrFrankenstein, useERC20 } from '../../hooks/useContract'
import useWeb3 from '../../hooks/useWeb3'
import Page from '../../components/layout/Page'
import Table from './components/Table'
import './HomeCopy.Styles.css'
import tableData from './data';



let web3;
let accountAddress;




const HomeC: React.FC = () => {

  const { account } = useWeb3React();
  const [showZmbeBtn, setShowZmbeBtn] = useState(true);
  const [farmData, setFormData] = useState(tableData);
  accountAddress = account
  const drFrankenstein = useDrFrankenstein();
  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const allowance = useIfoAllowance(zmbeContract, getDrFrankensteinAddress());

  // if allowance === 0 show the approve zombie don't call drFrankenstain
  // if allowance > 0 if(grave) paidUnlockFee === true amount 

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (accountAddress && parseInt(allowance.toString()) === 0) {
      const newFarmData = tableData.map((tokenInfo) => {
        drFrankenstein.methods.userInfo(tokenInfo.pid, accountAddress).call()
          .then(res => {
            // eslint-disable-next-line no-param-reassign
            tokenInfo.result = res;
          })
        return tokenInfo;
      })
      setFormData(newFarmData);
    }
  }, [allowance, drFrankenstein.methods])


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
        {farmData.map((data) => {
          return <Table details={data} key={data.id} />
        })}
      </div>
    </Page>
  )
}

export default HomeC
