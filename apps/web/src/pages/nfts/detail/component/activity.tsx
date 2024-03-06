import Image from 'next/image'
import copy from '../../assets/copy.svg'
import { Wrapper } from './activity.style'

export default function Activity() {
  const defaultItem = {
    id: 1,
    type: 'List',
    price: '15.24 ACE',
    from: '0xa323',
    to: '0xa323',
    time: '10mo ago',
  }
  const datasetList = [defaultItem, defaultItem, defaultItem, defaultItem]
  const columns = [
    {
      name: 'All Types',
      style: {
        width: '140px',
      },
      tdStyle: {
        // color: "rgba(249, 143, 18, 1)",
        // fontWeight: "700",
      },
    },
    {
      name: 'Price',
      style: {
        width: '140px',
      },
      tdStyle: {
        paddingLeft: '4px',
      },
    },
    {
      name: 'From',
      style: {
        width: '130px',
      },
    },
    {
      name: 'To',
      style: {
        width: '130px',
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
            {datasetList.map((item, index) => {
              return (
                <div className="sensei__table-body-tr" key={item.price}>
                  <div style={{ ...columns[0].style, ...(columns[0].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.type}
                    {/* <Image
                    className="sgt-offer__icon"
                    alt="icon"
                    src={item.icon}
                  ></Image> */}
                  </div>
                  <div style={{ ...columns[1].style, ...(columns[1].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.price}
                  </div>

                  <div style={{ ...columns[2].style, ...(columns[2].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.from}
                    <Image
                      src={copy}
                      alt="sgt"
                      width={24}
                      height={24}
                      style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                    />
                  </div>
                  <div style={{ ...columns[3].style, ...(columns[3].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.to}
                    <Image
                      src={copy}
                      alt="sgt"
                      width={24}
                      height={24}
                      style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ ...columns[4].style, ...(columns[4].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.time}
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
