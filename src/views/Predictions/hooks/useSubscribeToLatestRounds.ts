import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { GRAPH_WS_PREDICTIONS } from 'config/constants/endpoints'
import { getRoundsQuery } from 'state/predictions/queries'
import { setRounds } from 'state/predictions'
import { makeRoundData } from 'state/predictions/helpers'

const useSubscribeToLatestRounds = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const client = new SubscriptionClient(GRAPH_WS_PREDICTIONS, {
      reconnect: true,
    })
    const observable = client.request({
      query: `
        subscription {
          ${getRoundsQuery()}
        }
      `,
    })

    observable.subscribe({
      next: (data) => {
        console.log('dispatching data for', data.data.rounds)
        if (data.data?.rounds) {
          dispatch(setRounds(makeRoundData(data.data.rounds)))
        }
      },
      error: (error) => {
        console.error('Error occurred with prediction subscription', error)
      },
    })

    return () => {
      console.log('closing connection')
      client.close()
    }
  }, [dispatch])
}

export default useSubscribeToLatestRounds
