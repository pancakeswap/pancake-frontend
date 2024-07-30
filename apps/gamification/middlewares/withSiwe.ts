import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getViemClients } from 'utils/viem.server'
import { parseSiweMessage, validateSiweMessage, verifySiweMessage } from 'viem/siwe'

type ExtendedReq = NextApiRequest & {
  siwe: ReturnType<typeof parseSiweMessage>
}

export type ExtendedApiHandler = (req: ExtendedReq, res: NextApiResponse) => ReturnType<NextApiHandler>

export function withSiweAuth(handler: ExtendedApiHandler): ExtendedApiHandler {
  return async (req, res) => {
    const unauthorized = () => res.status(401).json({ message: 'Unauthorized' })
    const encodedMessage = req.headers['x-g-siwe-message']
    const signature = req.headers['x-g-siwe-signature']
    if (!encodedMessage || !signature || typeof encodedMessage !== 'string' || typeof signature !== 'string') {
      return unauthorized()
    }
    const message = decodeURIComponent(encodedMessage)
    const siweMessage = parseSiweMessage(message)
    const { address, chainId } = siweMessage
    const isMessageValid = validateSiweMessage({
      address,
      message: siweMessage,
    })
    if (!address || !chainId || !isMessageValid) {
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
