import { Seaport } from '@opensea/seaport-js'
import { AceIcon, AutoRow, Box, Button, Column, Flex, Loading, Text, useToast } from '@pancakeswap/uikit'
import { DOCKMAN_HOST, SEAPORT_ADDRESS } from 'config/nfts'
import { useState } from 'react'
import { ellipseAddress } from 'utils/address'
import { displayBalance } from 'utils/display'
import { useEthersSigner } from 'utils/ethers'
import { sleep } from 'utils/sleep'
import { useAccount } from 'wagmi'
import { Wrapper } from './offer.style'

const Item = ({ list, order, refetch }: { list: any; order: any; refetch?: any }) => {
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const signer = useEthersSigner()
  const { toastSuccess, toastError } = useToast()
  console.log(order)
  const onCancel = async (orderHash: string) => {
    if (!signer) return
    try {
      setLoading(true)
      const seaport = new Seaport(signer, {
        overrides: { contractAddress: SEAPORT_ADDRESS },
      })

      const tx = await seaport.cancelOrders([order.order.parameters])
      const res = await tx.transact()
      for (let i = 0; i < 30; i++) {
        // eslint-disable-next-line no-await-in-loop
        const rr = await fetch(`${DOCKMAN_HOST}/orders/status?order_hash=${order?.order_hash}`).then((r) => r.json())
        // eslint-disable-next-line no-await-in-loop
        await sleep(2000)
        if (rr?.order_status !== 'Normal') {
          break
        }
      }
      toastSuccess('Cancel order successfully')
      refetch?.()
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

      const tx = await seaport.fulfillOrder({ order: order.order })
      const res = await tx.executeAllActions()

      for (let i = 0; i < 20; i++) {
        // eslint-disable-next-line no-await-in-loop
        const rr = await fetch(`${DOCKMAN_HOST}/orders/status?order_hash=${orderHash}`).then((r) => r.json())
        // eslint-disable-next-line no-await-in-loop
        await sleep(2000)
        if (rr?.order_status !== 'Normal') {
          break
        }
      }
      toastSuccess('Purchase successfully')

      refetch?.()
    } catch (e: any) {
      const msg = e.toString()
      if (msg.includes('have the balances')) {
        toastError('The fulfiller does not have the balances needed to fulfill.')
      }
      console.error(e.toString())
    }

    setLoading(false)
  }

  return (
    <Flex key={order?.id}>
      <Box width="130px">
        <AutoRow gap="8px">
          {displayBalance(order.price)}
          <AceIcon />
        </AutoRow>
      </Box>
      <Box width="120px">
        <Text>{order.quantity}</Text>
      </Box>
      <Box width="200px">
        <Text>{ellipseAddress(order.from)}</Text>
      </Box>
      {order.from === address?.toLocaleLowerCase() ? (
        <Button scale="sm" onClick={() => onCancel(order.order_hash)} isLoading={loading}>
          {loading && <Loading />}
          Cancel
        </Button>
      ) : (
        <Button scale="sm" onClick={() => onAccept(order?.order_hash)} isLoading={loading}>
          {loading && <Loading />}
          Buy
        </Button>
      )}
    </Flex>
  )
}
export default function List({ list, refetch }: { list: any; refetch: any }) {
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
              {list?.map((l, i) => {
                return <Item key={l?.id} list={list} order={l} refetch={refetch} />
              })}
              {!list.length ? <span className="sensei__table-no-data">No Data</span> : ''}
            </Column>
          </Box>
        </div>
      </div>
    </Wrapper>
  )
}
