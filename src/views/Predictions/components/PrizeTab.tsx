import React, { useEffect, useState } from 'react'
import { BaseLayout, Box, LinkExternal } from '@rug-zombie-libs/uikit'
import styled, { DefaultTheme, useTheme } from 'styled-components'
import { BigNumber } from 'bignumber.js'
import auctions from '../../../redux/auctions'
import { getMausoleumContract } from '../../../utils/contractHelpers'
import { BIG_ZERO } from '../../../utils/bigNumber'
import { getBalanceAmount } from '../../../utils/formatBalance'
import { bnbPriceUsd } from '../../../redux/get'

const TableCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

const PrizeTab = () => {
  const auction = auctions[0]
  const [unlockFeeInBnb, setUnlockFeeInBnb] = useState(BIG_ZERO)

  useEffect(() => {
    getMausoleumContract().methods.unlockFeeInBnb(auction.aid).call()
      .then(res => {
        setUnlockFeeInBnb(new BigNumber(res))
      })
  }, [auction.aid])

  const type = 'image'
  return (
    <Box overflow='hidden'>
      <TableCards>
        <div className='table-bottom'>
          <div className='w-95 mx-auto mt-3'>
            <div className='flex-grow'>
              <div className='rug-indetails'>
                <div className='direction-column imageColumn'>
                  <div className='sc-iwajpm dcRUtg'>
                    {type === 'image' ? (
                      <img src='/images/rugZombie/Patient Zero.jpg' alt='CAKE' className='sc-cxNHIi bjMxQn' />
                    ) : (
                      <video width='100%' autoPlay>
                        <source src='' type='video/mp4' />
                      </video>
                    )}
                  </div>
                </div>
                <div className='direction-column'>
                  <span className='indetails-type'>Patient Zero Alpha</span>
                  <br />
                  <span className='indetails-title'>
                    Prize Details:
                  <span className='indetails-value'>
                    {auction.prizeDescription}
                  </span>
                  </span>
                  <br />
                  <span className='indetails-title'>
                    <LinkExternal bold={false} small href={auction.artist.twitter}>
                      View NFT Artist
                    </LinkExternal>
                  </span>

                </div>
                <div className='direction-column'>
                   <span className="indetails-type">Unlock Fees: {getBalanceAmount(unlockFeeInBnb).toString()} BNB
                    ({Math.round(getBalanceAmount(unlockFeeInBnb).times(bnbPriceUsd()).toNumber() * 100) / 100} in USD)
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TableCards>
    </Box>
  )
}

export default PrizeTab
