import { Fragment, memo } from 'react'
import { Trade, Currency, TradeType } from '@pancakeswap/sdk'
import { Text, Flex, ChevronRightIcon, Link } from '@pancakeswap/uikit'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { AkkaRouterInfoResponseType } from '../hooks/types'
import { uniqueId } from 'lodash'

export default memo(function SwapRoute({ route }: { route: AkkaRouterInfoResponseType }) {
  // Create better route object to filter routes to show in ui
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
          <Flex key={uniqueId()}>
            <Text fontSize={'12px'}>
              {(Number((item[2] / Number(route.input_amount)).toFixed(2)) * 100).toFixed()}%
            </Text>
            <ChevronRightIcon width="16px" />
            {JSON.parse(item[0]).routes[0].operations_seperated[0].operations.map((item, index, path) => {
              const isLastItem: boolean = index === path.length - 1
              return (
                <>
                  <Text fontSize={'12px'}> {item.ask_token[3]} </Text>
                  {!isLastItem && <ChevronRightIcon width="16px" />}
                </>
              )
            })}
          </Flex>
        )
      })}
      <Link
        href="https://www.app.akka.finance/"
        target={'_blank'}
        style={{ color: '#B8ADD2', fontSize: '12px', marginTop: '15px' }}
      >
        <svg width="109" height="15" viewBox="0 0 109 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_2245_16474)">
            <path d="M73 2V12H70.9103V3.73367H69.8654L68.5884 5.66834L64.409 12H62L68.5884 2H73Z" fill="white" />
            <path d="M99 2V12H100.9V3.73367H101.876L103.011 5.66834L106.81 12H109L103.011 2H99Z" fill="white" />
            <path
              d="M97 2.17588L96.8594 2H93.9357L84.3494 8.70854L81.7912 5.56784L86.8795 2H83.5904L78.0241 5.89447V2H76V12H78.0241V8.1809L80.1888 6.67337L84.5181 12H87.0201L85.5301 10.1658L90.1124 6.97487L94.245 12H96.747L91.7149 5.84422L97 2.17588Z"
              fill="white"
            />
            <path
              d="M3.79028 10.184C4.31828 10.184 4.76228 9.984 5.12228 9.584C5.48228 9.192 5.66228 8.684 5.66228 8.06C5.66228 7.444 5.48228 6.936 5.12228 6.536C4.76228 6.136 4.31828 5.936 3.79028 5.936C3.25428 5.936 2.80628 6.136 2.44628 6.536C2.09428 6.936 1.91828 7.444 1.91828 8.06C1.91828 8.684 2.09428 9.196 2.44628 9.596C2.80628 9.988 3.25428 10.184 3.79028 10.184ZM3.97028 11.192C3.53828 11.192 3.14228 11.1 2.78228 10.916C2.43028 10.732 2.15828 10.488 1.96628 10.184H1.91828L1.96628 11V13.592H0.862281V5.12H1.91828V5.936H1.96628C2.15828 5.632 2.43028 5.388 2.78228 5.204C3.14228 5.02 3.53828 4.928 3.97028 4.928C4.74628 4.928 5.40228 5.232 5.93828 5.84C6.49028 6.456 6.76628 7.196 6.76628 8.06C6.76628 8.932 6.49028 9.672 5.93828 10.28C5.40228 10.888 4.74628 11.192 3.97028 11.192ZM7.44147 8.06C7.44147 7.156 7.72547 6.408 8.29347 5.816C8.86947 5.224 9.59347 4.928 10.4655 4.928C11.3375 4.928 12.0575 5.224 12.6255 5.816C13.2015 6.408 13.4895 7.156 13.4895 8.06C13.4895 8.972 13.2015 9.72 12.6255 10.304C12.0575 10.896 11.3375 11.192 10.4655 11.192C9.59347 11.192 8.86947 10.896 8.29347 10.304C7.72547 9.712 7.44147 8.964 7.44147 8.06ZM8.54547 8.06C8.54547 8.692 8.72947 9.204 9.09747 9.596C9.46547 9.988 9.92147 10.184 10.4655 10.184C11.0095 10.184 11.4655 9.988 11.8335 9.596C12.2015 9.204 12.3855 8.692 12.3855 8.06C12.3855 7.436 12.2015 6.928 11.8335 6.536C11.4575 6.136 11.0015 5.936 10.4655 5.936C9.92947 5.936 9.47347 6.136 9.09747 6.536C8.72947 6.928 8.54547 7.436 8.54547 8.06ZM22.7031 5.12L20.8071 11H19.6791L18.2151 6.488L16.7631 11H15.6471L13.7511 5.12H14.9031L16.2111 9.56H16.2231L17.6751 5.12H18.8151L20.2671 9.56H20.2791L21.5751 5.12H22.7031ZM25.9448 11.192C25.0808 11.192 24.3688 10.896 23.8088 10.304C23.2488 9.712 22.9688 8.964 22.9688 8.06C22.9688 7.164 23.2408 6.42 23.7848 5.828C24.3288 5.228 25.0248 4.928 25.8728 4.928C26.7448 4.928 27.4368 5.212 27.9488 5.78C28.4688 6.34 28.7288 7.128 28.7288 8.144L28.7168 8.264H24.0968C24.1128 8.84 24.3048 9.304 24.6728 9.656C25.0408 10.008 25.4808 10.184 25.9928 10.184C26.6968 10.184 27.2488 9.832 27.6488 9.128L28.6328 9.608C28.3688 10.104 28.0008 10.492 27.5288 10.772C27.0648 11.052 26.5368 11.192 25.9448 11.192ZM24.1808 7.352H27.5528C27.5208 6.944 27.3528 6.608 27.0488 6.344C26.7528 6.072 26.3528 5.936 25.8488 5.936C25.4328 5.936 25.0728 6.064 24.7688 6.32C24.4728 6.576 24.2768 6.92 24.1808 7.352ZM30.8424 11H29.7384V5.12H30.7944V6.08H30.8424C30.9544 5.768 31.1824 5.504 31.5264 5.288C31.8784 5.064 32.2224 4.952 32.5584 4.952C32.8784 4.952 33.1504 5 33.3744 5.096L33.0384 6.164C32.9024 6.108 32.6864 6.08 32.3904 6.08C31.9744 6.08 31.6104 6.248 31.2984 6.584C30.9944 6.92 30.8424 7.312 30.8424 7.76V11ZM36.3745 11.192C35.5105 11.192 34.7985 10.896 34.2385 10.304C33.6785 9.712 33.3985 8.964 33.3985 8.06C33.3985 7.164 33.6705 6.42 34.2145 5.828C34.7585 5.228 35.4545 4.928 36.3025 4.928C37.1745 4.928 37.8665 5.212 38.3785 5.78C38.8985 6.34 39.1585 7.128 39.1585 8.144L39.1465 8.264H34.5265C34.5425 8.84 34.7345 9.304 35.1025 9.656C35.4705 10.008 35.9105 10.184 36.4225 10.184C37.1265 10.184 37.6785 9.832 38.0785 9.128L39.0625 9.608C38.7985 10.104 38.4305 10.492 37.9585 10.772C37.4945 11.052 36.9665 11.192 36.3745 11.192ZM34.6105 7.352H37.9825C37.9505 6.944 37.7825 6.608 37.4785 6.344C37.1825 6.072 36.7825 5.936 36.2785 5.936C35.8625 5.936 35.5025 6.064 35.1985 6.32C34.9025 6.576 34.7065 6.92 34.6105 7.352ZM42.8667 10.184C43.4107 10.184 43.8547 9.988 44.1987 9.596C44.5587 9.204 44.7387 8.692 44.7387 8.06C44.7387 7.444 44.5587 6.936 44.1987 6.536C43.8467 6.136 43.4027 5.936 42.8667 5.936C42.3387 5.936 41.8947 6.136 41.5347 6.536C41.1747 6.936 40.9947 7.444 40.9947 8.06C40.9947 8.684 41.1747 9.192 41.5347 9.584C41.8947 9.984 42.3387 10.184 42.8667 10.184ZM42.6867 11.192C41.9187 11.192 41.2587 10.888 40.7067 10.28C40.1627 9.664 39.8907 8.924 39.8907 8.06C39.8907 7.196 40.1627 6.456 40.7067 5.84C41.2587 5.232 41.9187 4.928 42.6867 4.928C43.1187 4.928 43.5107 5.02 43.8627 5.204C44.2227 5.388 44.4987 5.632 44.6907 5.936H44.7387L44.6907 5.12V2.408H45.7947V11H44.7387V10.184H44.6907C44.4987 10.488 44.2227 10.732 43.8627 10.916C43.5107 11.1 43.1187 11.192 42.6867 11.192ZM52.8855 11.192C52.4535 11.192 52.0575 11.1 51.6975 10.916C51.3455 10.732 51.0735 10.488 50.8815 10.184H50.8335V11H49.7775V2.408H50.8815V5.12L50.8335 5.936H50.8815C51.0735 5.632 51.3455 5.388 51.6975 5.204C52.0575 5.02 52.4535 4.928 52.8855 4.928C53.6615 4.928 54.3175 5.232 54.8535 5.84C55.4055 6.456 55.6815 7.196 55.6815 8.06C55.6815 8.932 55.4055 9.672 54.8535 10.28C54.3175 10.888 53.6615 11.192 52.8855 11.192ZM52.7055 10.184C53.2335 10.184 53.6775 9.984 54.0375 9.584C54.3975 9.192 54.5775 8.684 54.5775 8.06C54.5775 7.444 54.3975 6.936 54.0375 6.536C53.6775 6.136 53.2335 5.936 52.7055 5.936C52.1695 5.936 51.7215 6.136 51.3615 6.536C51.0095 6.936 50.8335 7.444 50.8335 8.06C50.8335 8.684 51.0095 9.196 51.3615 9.596C51.7215 9.988 52.1695 10.184 52.7055 10.184ZM61.7132 5.12L58.0292 13.592H56.8892L58.2572 10.628L55.8332 5.12H57.0332L58.7852 9.344H58.8092L60.5132 5.12H61.7132Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_2245_16474">
              <rect width="109" height="15" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Link>
    </Flex>
  )
})
