import { AceIcon, Box, Column } from '@pancakeswap/uikit'
import { displayBalance } from 'utils/display'
import { ellipseAddress } from 'utils/address'
import { useAccount } from 'wagmi'
import Button from '../../Button'
import { Wrapper } from './offer.style'

export default function Offer({ offers, nft }: { offers: any; nft: any }) {
  const { address } = useAccount()
  const isOwner = address?.toLocaleLowerCase() === nft?.owner

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
          <Box maxHeight="160px">
            <Column gap="12px">
              {offers?.map((offer, index) => {
                return (
                  <div className="sensei__table-body-tr" key={offer?.id}>
                    <div
                      style={{ ...columns[0].style, ...(columns[0].tdStyle || {}) }}
                      className="sensei__table-body-td"
                    >
                      {displayBalance(offer.price)}
                      <AceIcon />
                    </div>
                    <div
                      style={{ ...columns[1].style, ...(columns[1].tdStyle || {}) }}
                      className="sensei__table-body-td"
                    >
                      {offer.quantity}
                    </div>
                    <div
                      style={{ ...columns[2].style, ...(columns[2].tdStyle || {}) }}
                      className="sensei__table-body-td"
                    >
                      {ellipseAddress(offer.from)}
                    </div>

                    {isOwner && (
                      <div
                        style={{ ...columns[3].style, ...(columns[3].tdStyle || {}) }}
                        className="sensei__table-body-td"
                      >
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
                    )}
                  </div>
                )
              })}
            </Column>
          </Box>
        </div>
      </div>
    </Wrapper>
  )
}
