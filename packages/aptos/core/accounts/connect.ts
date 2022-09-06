import { ConnectorAlreadyConnectedError } from 'wagmi'
import { Connector, ConnectorData } from '../connectors'
import { getClient } from '../client'

export type ConnectArgs = {
  /** Connector to connect */
  connector: Connector
}

type Data = ConnectorData

export type ConnectResult = {
  account: Data['account']
  network: Data['network']
}

export async function connect({ connector }: ConnectArgs): Promise<ConnectResult> {
  const client = getClient()
  const activeConnector = client.connector
  if (connector.id === activeConnector?.id) throw new ConnectorAlreadyConnectedError()

  try {
    client.setState((x) => ({ ...x, status: 'connecting' }))

    const account = await connector.connect()
    const network = await connector.network()

    client.setLastUsedConnector(connector.id)
    client.setState((x) => ({
      ...x,
      connector,
      data: {
        account,
        network: {
          networkName: network,
        },
      },
      status: 'connected',
    }))
    client.storage.setItem('connected', true)

    return {
      account,
      network: {
        networkName: network,
      },
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
