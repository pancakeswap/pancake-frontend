/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import { Heading } from '@rug-zombie-libs/uikit';
import { useWeb3React } from '@web3-react/core';
import { getAddress, getDrFrankensteinAddress } from 'utils/addressHelpers';
import tokens from 'config/constants/tokens';
import { useIfoAllowance } from 'hooks/useAllowance';
import { getBnbPriceinBusd } from 'state/hooks';
import { useDrFrankenstein, useERC20 } from '../../hooks/useContract'
import Page from '../../components/layout/Page'
import Table from './components/Table';
import './HomeCopy.Styles.css'
import tableData from './data';

let accountAddress;

const HomeC: React.FC = () => {

  const { account } = useWeb3React();
  const [ isAllowance, setIsAllowance] = useState(false);
  const [farmData, setFormData] = useState(tableData);

  accountAddress = account
  const drFrankenstein = useDrFrankenstein();
  const zmbeContract = useERC20(getAddress(tokens.zmbe.address));
  const allowance = useIfoAllowance(zmbeContract, getDrFrankensteinAddress());
  const [bnbInBusd, setBnbInBusd] = useState(0);

  // if allowance === 0 show the approve zombie don't call drFrankenstain
  // if allowance > 0 if(grave) paidUnlockFee === true amount

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (accountAddress) {
      const newFarmData = tableData.map((tokenInfo) => {
        drFrankenstein.methods.userInfo(tokenInfo.pid, accountAddress).call()
          .then(res => {
            tokenInfo.result = res;
          })
          drFrankenstein.methods.poolInfo(tokenInfo.pid).call().then(res => {
            tokenInfo.poolInfo = res;
          })
          drFrankenstein.methods.pendingZombie(tokenInfo.pid, accountAddress).call()
          .then(res => {
            tokenInfo.pendingZombie = res;
          })

        return tokenInfo;
      })
      setFormData(newFarmData);
      getBnbPriceinBusd().then((res) => {
        setBnbInBusd(res.data.price)
      })
    }

    if(parseInt(allowance.toString()) !== 0){
      setIsAllowance(true);
    }
    
  }, [allowance, drFrankenstein.methods])


  return (
    <Page className="innnerContainer">
      <PageHeader background="none">
        <Heading color="secondary" mb="24px">
          Graves
        </Heading>
        <Heading color="text">
          Stake $ZMBE to Earn NFTs
        </Heading>
      </PageHeader>
      <div>
        {farmData.map((data) => {
          return <Table bnbInBusd={bnbInBusd} isAllowance={isAllowance} details={data} key={data.id} />
        })}
      </div>
    </Page>
  )
}

export default HomeC
