import React, { useEffect } from 'react'
import { BaseLayout, Box, LinkExternal } from '@rug-zombie-libs/uikit'
import styled, { DefaultTheme, useTheme } from 'styled-components'
import FrankEarned from '../../Graves/components/FrankEarned/FrankEarned'
import StartFarming from '../../Graves/components/StartFarming/StartFarming'
import BuyFrank from '../../Graves/components/BuyFrank/BuyFrank'
import RugInDetails from '../../Graves/components/RugInDetails'
import { getBalanceAmount } from '../../../utils/formatBalance'
import tokens from '../../../config/constants/tokens'
import artists from '../../../config/constants/artists'

/**
 * When the script tag is injected the TradingView object is not immediately
 * available on the window. So we listen for when it gets set
 */


const TableCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

const PrizeTab = () => {

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
                    Not much is known about the origin of the first humans gone zombie. We do know this one loved tacos.
                  </span>
                  </span>
                  <br />
                  <span className='indetails-title'>
                    <LinkExternal bold={false} small href={artists.jussjoshinduh.twitter}>
                      View NFT Artist
                    </LinkExternal>
                  </span>

                </div>
                <div className='direction-column'>
                   <span className="indetails-type">Unlock Fees: 0 BNB
                    (0 in USD)
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
