import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getViemClients } from 'utils/viem.server'
import { parseSiweMessage, verifySiweMessage } from 'viem/siwe'

type ExtendedReq = NextApiRequest & {
  siwe: ReturnType<typeof parseSiweMessage>
}

export type ExtendedApiHandler = (req: ExtendedReq, res: NextApiResponse) => ReturnType<NextApiHandler>

export function withSiweAuth(handler: ExtendedApiHandler): ExtendedApiHandler {
  return async (req, res) => {
    const unauthorized = () => res.status(401).json({ message: 'Unauthorized' })
    const encodedMessage = req.headers['x-g-siwe-message']
    const signature = req.headers['x-g-siwe-signature']
    const chainId = req.headers['x-g-siwe-chain-id']
    if (
      !encodedMessage ||
      !signature ||
      typeof encodedMessage !== 'string' ||
      typeof signature !== 'string' ||
      !chainId
    ) {
      return unauthorized()
    }
    const message = decodeURIComponent(encodedMessage)
    const siweMessage = parseSiweMessage(message)
    const { address } = siweMessage
    if (!address) {
      return unauthorized()
    }
    const client = getViemClients({ chainId: Number(chainId) })
    const validSignature = await verifySiweMessage(client, {
      message,
      signature: signature as `0x{string}`,
    })
    if (!validSignature) {
      return unauthorized()
    }
    // eslint-disable-next-line no-param-reassign
    req.siwe = siweMessage
    return handler(req, res)
  }
}
