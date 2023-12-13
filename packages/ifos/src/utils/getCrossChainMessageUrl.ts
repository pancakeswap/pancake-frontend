import { CrossChainMessage } from '../types'
import { getLayerZeroChainId } from './getLayerZeroChainId'

export function getCrossChainMessageUrl({
  srcChainId,
  srcUaNonce,
  srcUaAddress,
  dstChainId,
  dstUaAddress,
}: CrossChainMessage) {
  const lzSrcChainId = getLayerZeroChainId(srcChainId)
  const lzDstChainId = getLayerZeroChainId(dstChainId)

  return `https://layerzeroscan.com/${lzSrcChainId}/address/${srcUaAddress}/message/${lzDstChainId}/address/${dstUaAddress}/nonce/${srcUaNonce}`
}
