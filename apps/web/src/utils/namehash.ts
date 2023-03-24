import namehase from '@ensdomains/eth-ens-namehash'
import { keccak_256 as sha3 } from 'js-sha3'
import { Buffer } from 'buffer'

export function namehash(inputName) {
  let node = ''
  for (let i = 0; i < 32; i++) {
    node += '00'
  }

  if (inputName) {
    const labels = inputName.split('.')

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha
      if (isEncodedLabelhash(labels[i])) {
        labelSha = decodeLabelhash(labels[i])
      } else {
        const normalisedLabel = namehase.normalize(labels[i])
        labelSha = sha3(normalisedLabel)
      }
      node = sha3(Buffer.from(node + labelSha, 'hex'))
    }
  }

  return `0x${node}`
}

function isEncodedLabelhash(hash) {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66
}

function decodeLabelhash(hash) {
  if (!(hash.startsWith('[') && hash.endsWith(']'))) {
    throw Error('Expected encoded labelhash to start and end with square brackets')
  }

  if (hash.length !== 66) {
    throw Error('Expected encoded labelhash to have a length of 66')
  }

  return `${hash.slice(1, -1)}`
}
