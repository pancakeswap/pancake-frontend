import { AceIcon, AutoRow, Box, Button, Column, Flex, Loading, Text, useToast } from '@pancakeswap/uikit'
import { displayBalance } from 'utils/display'
import { ellipseAddress } from 'utils/address'
import { useAccount } from 'wagmi'
import { useEthersSigner } from 'utils/ethers'
import { Seaport } from '@opensea/seaport-js'
import { DOCKMAN_HOST, SEAPORT_ADDRESS } from 'config/nfts'
import { useState } from 'react'
import { Wrapper } from './offer.style'

export default function List({ list, refetch }: { list: any; refetch: any }) {
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const signer = useEthersSigner()
  const { toastSuccess } = useToast()

  const onCancel = async (orderHash: string) => {
    if (!signer) return
    try {
      setLoading(true)
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS },
      })

      const order = list?.find((l) => l.order_hash === orderHash)

      const tx = await seaport.cancelOrders([order.order.parameters])
      const res = await tx.transact()
      toastSuccess('Cancel order successfully')
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }
  const onAccept = async (orderHash: string) => {
    if (!signer) return
    setLoading(true)
    try {
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS },
      })

      const order = list?.find((l) => l.order_hash === orderHash)

      const tx = await seaport.fulfillOrder({ order: order.order })
      const res = await tx.executeAllActions()

      const orderRes = await fetch(`${DOCKMAN_HOST}/orders/status?order_hash=${orderHash}`).then((r) => r.json())

      console.log(orderRes)
      refetch?.()
    } catch (e: any) {
      console.error(e.toString())
    }

    setLoading(false)
  }

  return (
    <Wrapper>
      <div className="sgt-offer__wrapper">
        <div className="sensei__table">
          <Text color="textSubtle">
            <AutoRow mb="20px">
              <Box width="125px">Price</Box>
              <Box width="120px">Quantity</Box>
              <Box>From</Box>
            </AutoRow>
          </Text>
          <Box maxHeight="160px">
            <Column gap="4px">
              {list?.map((l) => {
                return (
                  <Flex key={l?.id}>
                    <Box width="160px">
                      <AutoRow gap="8px">
                        {displayBalance(l.price)}
                        <AceIcon />
                      </AutoRow>
                    </Box>
                    <Box width="140px">
                      <Text>{l.quantity}</Text>
                    </Box>
                    <Box width="200px">
                      <Text>{ellipseAddress(l.from)}</Text>
                    </Box>
                    {l.from === address?.toLocaleLowerCase() ? (
                      <Button scale="sm" onClick={() => onCancel(l.order_hash)} isLoading={loading}>
                        {loading && <Loading />}
                        Cancel
                      </Button>
                    ) : (
                      <Button scale="sm" onClick={() => onAccept(l?.order_hash)} isLoading={loading}>
                        {loading && <Loading />}
                        Buy
                      </Button>
                    )}
                  </Flex>
                )
              })}
            </Column>
          </Box>
        </div>
      </div>
    </Wrapper>
  )
}
