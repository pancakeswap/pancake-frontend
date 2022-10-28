import { Connector, ConnectorData } from '../connectors'
import { getClient } from '../client'
import { ConnectorAlreadyConnectedError } from '../errors'

export type ConnectArgs = {
  /** Connector to connect */
  connector: Connector
  /** Network to connect */
  networkName?: string
}

type Data = ConnectorData

export type ConnectResult = {
  account: Data['account']
  network: Data['network']
  connector: Connector
}

export async function connect({ connector, networkName }: ConnectArgs): Promise<ConnectResult> {
  const client = getClient()
  const activeConnector = client.connector
  if (connector.id === activeConnector?.id) throw new ConnectorAlreadyConnectedError()

  try {
    client.setState((x) => ({ ...x, status: 'connecting' }))

    const data = await connector.connect({ networkName })

    client.setLastUsedConnector(connector.id)
    client.setState((x) => ({
      ...x,
      connector,
      data,
      status: 'connected',
    }))
    client.storage.setItem('connected', true)

    return {
      ...data,
      connector,
    } as const
  } catch (err) {
    client.setState((x) => {
      return {
        ...x,
        // Keep existing connector connected in case of error
        status: x.connector ? 'connected' : 'disconnected',
      }
    })
    throw err
  }
}
