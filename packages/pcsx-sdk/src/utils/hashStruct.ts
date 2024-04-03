// purely from viem
import { encodeAbiParameters, keccak256, toHex } from 'viem'

type AbiParameter = any

type MessageTypeProperty = {
  name: string
  type: string
}

export function hashStruct({
  data,
  primaryType,
  types,
}: {
  data: Record<string, unknown>
  primaryType: string
  types: Record<string, MessageTypeProperty[]>
}) {
  const encoded = encodeData({
    data,
    primaryType,
    types,
  })
  return keccak256(encoded)
}

function encodeData({
  data,
  primaryType,
  types,
}: {
  data: Record<string, unknown>
  primaryType: string
  types: Record<string, MessageTypeProperty[]>
}) {
  const encodedTypes: AbiParameter[] = [{ type: 'bytes32' }]
  const encodedValues: unknown[] = [hashType({ primaryType, types })]

  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name],
    })
    encodedTypes.push(type)
    encodedValues.push(value)
  }

  return encodeAbiParameters(encodedTypes, encodedValues)
}

function encodeField({
  types,
  name,
  type,
  value,
}: {
  types: Record<string, MessageTypeProperty[]>
  name: string
  type: string
  value: any
}): [type: AbiParameter, value: any] {
  if (types[type] !== undefined) {
    return [{ type: 'bytes32' }, keccak256(encodeData({ data: value, primaryType: type, types }))]
  }

  if (type === 'bytes') {
    const prepend = value.length % 2 ? '0' : ''
    // eslint-disable-next-line no-param-reassign
    value = `0x${prepend + value.slice(2)}`
    return [{ type: 'bytes32' }, keccak256(value)]
  }

  if (type === 'string') return [{ type: 'bytes32' }, keccak256(toHex(value))]

  if (type.lastIndexOf(']') === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf('['))
    const typeValuePairs = (value as [AbiParameter, any][]).map((item) =>
      encodeField({
        name,
        type: parsedType,
        types,
        value: item,
      }),
    )
    return [
      { type: 'bytes32' },
      keccak256(
        encodeAbiParameters(
          typeValuePairs.map(([t]) => t),
          typeValuePairs.map(([, v]) => v),
        ),
      ),
    ]
  }

  return [{ type }, value]
}

function hashType({ primaryType, types }: { primaryType: string; types: Record<string, MessageTypeProperty[]> }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }))
  return keccak256(encodedHashType)
}

function encodeType({ primaryType, types }: { primaryType: string; types: Record<string, MessageTypeProperty[]> }) {
  let result = ''
  const unsortedDeps = findTypeDependencies({ primaryType, types })
  unsortedDeps.delete(primaryType)

  const deps = [primaryType, ...Array.from(unsortedDeps).sort()]
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(',')})`
  }

  return result
}

function findTypeDependencies(
  {
    primaryType: primaryType_,
    types,
  }: {
    primaryType: string
    types: Record<string, MessageTypeProperty[]>
  },
  results: Set<string> = new Set(),
): Set<string> {
  const match = primaryType_.match(/^\w*/u)
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const primaryType = match?.[0]!
  if (results.has(primaryType) || types[primaryType] === undefined) {
    return results
  }

  results.add(primaryType)

  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results)
  }
  return results
}
