import { AceIcon, AutoRow, Box, Button, Text } from '@pancakeswap/uikit'
import { displayBalance } from 'utils/display'
import { ellipseAddress } from 'utils/address'
import { useAccount } from 'wagmi'
import { useEthersSigner } from 'utils/ethers'
import { Seaport } from '@opensea/seaport-js'
import { SEAPORT_ADDRESS } from 'config/nfts'
import { Wrapper } from './offer.style'

export default function List({ list }: { list: any }) {
  const { address } = useAccount()
  const signer = useEthersSigner()

  const onAccept = async (orderHash: string) => {
    if (!signer) return
    const seaport = new Seaport(signer, {
      overrides: { contractAddress: SEAPORT_ADDRESS },
    })

    const order = list?.find((l) => l.order_hash === orderHash)

    const tx = await seaport.fulfillOrder({ order: order.content })
    const res = await tx.executeAllActions()
  }

  return (
    <Wrapper>
      <div className="sgt-offer__wrapper">
        <div className="sensei__table">
          <Text color="textSubtle">
            <AutoRow mb="20px">
              <Box width="160px">Price</Box>
              <Box width="160px">Quantity</Box>
              <Box>From</Box>
            </AutoRow>
          </Text>
          <div className="sensei__table-body">
            {list?.map((l, index) => {
              return (
                <AutoRow key={l?.id}>
                  <Box width="160px">
                    <AutoRow gap="8px">
                      {displayBalance(l.price)}
                      <AceIcon />
                    </AutoRow>
                  </Box>
                  <Box width="160px">
                    <Text>{l.quantity}</Text>
                  </Box>
                  <Box width="200px">
                    <Text>{ellipseAddress(l.user_address)}</Text>
                  </Box>
                  <Button scale="sm" onClick={() => onAccept(l?.order_hash)}>
                    Buy
                  </Button>
                </AutoRow>
              )
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
