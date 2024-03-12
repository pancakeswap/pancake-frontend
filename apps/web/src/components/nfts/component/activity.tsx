import Image from 'next/image'
import { ellipseAddress } from 'utils/address'

import { CopyIcon, Link } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { getBlockExploreLink } from 'utils'
import { ChainId } from '@pancakeswap/chains'
import { displayBalance } from 'utils/display'
import { Wrapper } from './activity.style'

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
        // width: "140px",
        flex: 1,
      },
      tdStyle: {
        color: '#928D88',
      },
    },
  ]
  return (
    <Wrapper>
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
          <div className="sensei__table-body">
            {activities?.map((activity, index) => {
              return (
                <div className="sensei__table-body-tr" key={activity.price}>
                  <div style={{ ...columns[0].style, ...(columns[0].tdStyle || {}) }} className="sensei__table-body-td">
                    {activity.activity_type}
                  </div>
                  <div style={{ ...columns[1].style, ...(columns[1].tdStyle || {}) }} className="sensei__table-body-td">
                    {displayBalance(activity.price)}
                  </div>

                  <div style={{ ...columns[2].style, ...(columns[2].tdStyle || {}) }} className="sensei__table-body-td">
                    {activity?.activity_type === 'Mint' ? 'Null' : ellipseAddress(activity?.from)}
                  </div>
                  <Link
                    href={getBlockExploreLink(activity?.to, 'address', ChainId.ENDURANCE)}
                    style={{ ...columns[3].style, ...(columns[3].tdStyle || {}) }}
                    className="sensei__table-body-td"
                  >
                    {ellipseAddress(activity?.to, 5)}
                  </Link>

                  <div style={{ ...columns[4].style, ...(columns[4].tdStyle || {}) }} className="sensei__table-body-td">
                    {dayjs(activity?.time).fromNow()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
