import { ellipseAddress } from 'utils/address'

import { ChainId } from '@pancakeswap/chains'
import { Box, Column, Flex, Link } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { displayBalance } from 'utils/display'

const ItemRow = styled(Flex)`
  & div {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
`

export default function Activity({ activities }: { activities: any[] }) {
  const columns = [
    {
      name: 'All Types',
      style: {
        width: '110px',
      },
      tdStyle: {
        paddingLeft: '0px',
      },
    },
    {
      name: 'Price',
      style: {
        width: '120px',
      },
      tdStyle: {
        paddingLeft: '4px',
      },
    },
    {
      name: 'From',
      style: {
        width: '140px',
      },
      tdStyle: {
        paddingLeft: '0px',
      },
    },
    {
      name: 'To',
      style: {
        width: '140px',
      },
      tdStyle: {
        paddingLeft: '0px',
      },
    },
    {
      name: 'Time',
      style: {
        width: '180px',
      },
      tdStyle: {
        color: '#928D88',
      },
    },
  ]
  return (
    <>
      <div className="sgt-offer__wrapper">
        <div className="sensei__table">
          <div className="sensei__table-header">
            {columns.map((item, index) => {
              return (
                <div key={item.name} style={item.style} className="sensei__table-header-item">
                  {item.name}
                </div>
              )
            })}
          </div>
          <Box maxHeight="160px">
            <Column gap="0px" mt="12px">
              {activities?.map((activity, index) => {
                return (
                  <ItemRow key={activity?.id}>
                    <Box width="110px">{activity.activity_type}</Box>
                    <Box width="120px">{displayBalance(activity.price)}</Box>
                    <Box width="140px">
                      {activity?.activity_type === 'Mint' ? 'Null' : ellipseAddress(activity?.from)}
                    </Box>

                    <Box width="140px">
                      <Link
                        href={getBlockExploreLink(activity?.to, 'address', ChainId.ENDURANCE)}
                        className="sensei__table-body-td"
                      >
                        {ellipseAddress(activity?.to, 5)}
                      </Link>
                    </Box>

                    <Box width="180px">{dayjs(activity?.time).fromNow()}</Box>
                  </ItemRow>
                )
              })}
            </Column>
          </Box>
        </div>
      </div>
    </>
  )
}
