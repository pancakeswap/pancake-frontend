import Image from 'next/image'
import Button from '../../Button'
import { Wrapper } from './offer.style'

export default function Offer() {
  const defaultItem = {
    id: 1,
    icon: null,
    price: 15.24,
    quantity: 1,
    sgr: '+56.12',
    sgrIcon: null,
    from: '0xa323',
  }
  const datasetList = [defaultItem, defaultItem, defaultItem, defaultItem]
  const columns = [
    {
      name: 'Price',
      style: {
        width: '140px',
      },
      tdStyle: {
        color: 'rgba(249, 143, 18, 1)',
        fontWeight: '700',
      },
    },
    {
      name: 'Quantity',
      style: {
        width: '150px',
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
    },
    {
      name: '',
      style: {
        paddingLeft: '32px',
        flex: '1',
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
                    {item.price}
                    <Image className="sgt-offer__icon" alt="icon" src={item.icon} />
                  </div>
                  <div style={{ ...columns[1].style, ...(columns[1].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.quantity}
                  </div>
                  {/* <div
                  style={{ ...columns[2].style, ...(columns[2].tdStyle || {}) }}
                  className="sensei__table-body-td"
                >
                  <div className="sgt-offer__tag">
                    <div className="sgt-offer__tag-content">{item.sgr}</div>
                    <Image
                      className="sgt-offer__icon"
                      alt="icon"
                      src={item.sgrIcon}
                    ></Image>
                  </div>
                </div> */}
                  <div style={{ ...columns[2].style, ...(columns[2].tdStyle || {}) }} className="sensei__table-body-td">
                    {item.from}
                  </div>

                  <div style={{ ...columns[3].style, ...(columns[3].tdStyle || {}) }} className="sensei__table-body-td">
                    <Button
                      style={{
                        width: '116px',
                      }}
                      type="transparent"
                      size="sm"
                    >
                      Accept
                    </Button>
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
