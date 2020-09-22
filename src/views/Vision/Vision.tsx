import React from 'react'
import styled from 'styled-components'

import { useTokenBalance2 } from '../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../utils/formatBalance'

const Farm: React.FC = () => {

  // eos-bnb
  const eosBalance = getBalanceNumber(useTokenBalance2('0x56b6fb708fc5732dec1afc8d8556423a2edccbd6', '0x981d2Ba1b298888408d342C39c2Ab92e8991691e'))
  const bnbBalance0 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x981d2Ba1b298888408d342C39c2Ab92e8991691e'))
  // link-bnb
  const linkBalance = getBalanceNumber(useTokenBalance2('0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd', '0xaeBE45E3a03B734c68e5557AE04BFC76917B4686'))
  const bnbBalance1 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xaeBE45E3a03B734c68e5557AE04BFC76917B4686'))
  // band-bnb
  const bandBalance = getBalanceNumber(useTokenBalance2('0xad6caeb32cd2c308980a548bd0bc5aa4306c6c18', '0xc639187ef82271D8f517de6FEAE4FaF5b517533c'))
  const bnbBalance2 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xc639187ef82271D8f517de6FEAE4FaF5b517533c'))
  // burger-bnb
  const burgerBalance = getBalanceNumber(useTokenBalance2('0xae9269f27437f0fcbc232d39ec814844a51d6b8f', '0x4cE6703ca7D76F3E65B884C957249035011866F2'))
  const bnbBalance3 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x4cE6703ca7D76F3E65B884C957249035011866F2'))

  // ada-bnb
  const adaBalance = getBalanceNumber(useTokenBalance2('0x3ee2200efb3400fabb9aacf31297cbdd1d435d47', '0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF'))
  const bnbBalance4 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF'))
  // dot-bnb
  const dotBalance = getBalanceNumber(useTokenBalance2('0x7083609fce4d1d8dc0c979aab8c869ea2c873402', '0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c'))
  const bnbBalance5 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c'))
  // busd-bnb
  const busdBalance = getBalanceNumber(useTokenBalance2('0xe9e7cea3dedca5984780bafc599bd69add087d56', '0x1B96B92314C44b159149f7E0303511fB2Fc4774f'))
  const bnbBalance6 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0x1B96B92314C44b159149f7E0303511fB2Fc4774f'))

  // bake-bnb
  const bakeBalance = getBalanceNumber(useTokenBalance2('0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5', '0xE2D1B285d83efb935134F644d00FB7c943e84B5B'))
  const bnbBalance7 = getBalanceNumber(useTokenBalance2('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', '0xE2D1B285d83efb935134F644d00FB7c943e84B5B'))


  const totalBnb = bnbBalance0+ bnbBalance1+bnbBalance2+ bnbBalance3+bnbBalance4+ bnbBalance5+bnbBalance6+ bnbBalance7

  return (
    <StyledFarm>
    Estimated total value: ${busdBalance/bnbBalance6 * totalBnb *2}<br/><br/>
    EOS/BNB Pair<br/>
    EOS:{eosBalance}<br/>
    BNB: {bnbBalance0}<br/>
    <a href={`https://bscscan.com/address/0x981d2Ba1b298888408d342C39c2Ab92e8991691e`} target="_blank">link</a>
    <br/><br/>
    LINK/BNB Pair<br/>
    LINK:{linkBalance}<br/>
    BNB: {bnbBalance1}<br/>
    <a href={`https://bscscan.com/address/0xaeBE45E3a03B734c68e5557AE04BFC76917B4686`} target="_blank">link</a>
    <br/><br/>
    BAND/BNB Pair<br/>
    BAND:{bandBalance}<br/>
    BNB: {bnbBalance2}<br/>
    <a href={`https://bscscan.com/address/0xc639187ef82271D8f517de6FEAE4FaF5b517533c`} target="_blank">link</a>
    <br/><br/>
    BURGER/BNB Pair<br/>
    BURGER:{burgerBalance}<br/>
    BNB: {bnbBalance3}<br/>
    <a href={`https://bscscan.com/address/0x4cE6703ca7D76F3E65B884C957249035011866F2`} target="_blank">link</a>
    <br/><br/>
    ADA/BNB Pair<br/>
    ADA:{adaBalance}<br/>
    BNB: {bnbBalance4}<br/>
    <a href={`https://bscscan.com/address/0xBA51D1AB95756ca4eaB8737eCD450cd8F05384cF`} target="_blank">link</a>
    <br/><br/>
    DOT/BNB Pair<br/>
    DOT:{dotBalance}<br/>
    BNB: {bnbBalance5}<br/>
    <a href={`https://bscscan.com/address/0xbCD62661A6b1DEd703585d3aF7d7649Ef4dcDB5c`} target="_blank">link</a>
    <br/><br/>
    BUSD/BNB Pair<br/>
    BUSD:{busdBalance}<br/>
    BNB: {bnbBalance6}<br/>
    <a href={`https://bscscan.com/address/0x1B96B92314C44b159149f7E0303511fB2Fc4774f`} target="_blank">link</a>
    <br/><br/>
    BAKE/BNB Pair<br/>
    BAKE:{bakeBalance}<br/>
    BNB: {bnbBalance7}<br/>
    <a href={`https://bscscan.com/address/0xE2D1B285d83efb935134F644d00FB7c943e84B5B`} target="_blank">link</a>

    </StyledFarm>
  )
}

const StyledFarm = styled.div`
  text-align: left;
  width: 60vw;
  margin: 50px auto;
  > div{
    display:  inline-block;
    text-align: left;
  }
`


export default Farm
