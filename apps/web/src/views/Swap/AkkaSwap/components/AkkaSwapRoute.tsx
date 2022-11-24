import { Fragment, memo } from 'react'
import { Trade, Currency, TradeType } from '@pancakeswap/sdk'
import { Text, Flex, ChevronRightIcon, Link } from '@pancakeswap/uikit'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AkkaRouterInfoResponseType } from '../hooks/types'

export default memo(function SwapRoute({ route }: { route: AkkaRouterInfoResponseType }) {
  let bigtertRoute = route.routes.bitgert
  bigtertRoute.forEach((item) => {
    // delete item.input_amount;
    // delete item.input_amount_in_usd;
    // delete item.input_amount_wei;
    // delete item.return_amount;
    // delete item.return_amount_in_usd;
    // delete item.return_amount_wei;

    // delete item.routes[0].input_amount;
    // delete item.routes[0].input_amount_wei;
    // delete item.routes[0].return_amount;
    // delete item.routes[0].return_amount_wei;
    // delete item.routes[0].operations;
    item.routes[0].operations_seperated[0].operations.forEach((item) => {
      delete item.amount_in
      delete item.amount_in_wei
      delete item.amount_out
      delete item.amount_out_wei
    })
  })
  const result = bigtertRoute.filter(
    (thing, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          JSON.stringify(t.routes[0].operations_seperated) === JSON.stringify(thing.routes[0].operations_seperated),
      ),
  )
  function count() {
    let array_elements = result.map((item) => {
      return JSON.stringify(item)
    })
    array_elements.sort()

    let array_elements2 = bigtertRoute.map((item) => {
      return JSON.stringify(item)
    })
    array_elements2.sort()
    var array = []
    for (var i = 0; i < array_elements.length; i++) {
      var cnt = 0
      var sum = 0
      for (var j = 0; j < array_elements2.length; j++) {
        if (
          JSON.stringify(JSON.parse(array_elements[i]).routes[0].operations_seperated) ===
          JSON.stringify(JSON.parse(array_elements2[j]).routes[0].operations_seperated)
        ) {
          sum += JSON.parse(array_elements2[j]).routes[0].input_amount
          cnt++
        }
      }
      array.push([array_elements[i], cnt, sum])
    }
    return array
  }
  let modifiedArray = count()
  return (
    <Flex
      flexDirection={'column'}
      flexWrap="wrap"
      width="100%"
      alignItems="flex-end"
      marginY={'10px'}
      marginLeft={'10px'}
    >
      {modifiedArray.map((item, index) => {
        return (
          <Flex>
            <Text fontSize={"12px"}>{(Number((item[2] / Number(route.input_amount)).toFixed(2)) * 100).toFixed()}%</Text>
            <ChevronRightIcon width="16px" />
            {JSON.parse(item[0]).routes[0].operations_seperated[0].operations.map((item, index, path) => {
              const isLastItem: boolean = index === path.length - 1
              return (
                <>
                  <Text fontSize={"12px"}> {item.ask_token[3]} </Text>
                  {!isLastItem && <ChevronRightIcon width="16px" />}
                </>
              )
            })}
          </Flex>
        )
      })}
      <Link href="https://www.app.akka.finance/" target={'_blank'} style={{ color: '#B8ADD2', fontSize: '12px' }}>
        Powered by AKKA
      </Link>
    </Flex>
  )
})
