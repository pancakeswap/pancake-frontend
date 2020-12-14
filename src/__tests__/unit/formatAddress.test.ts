import formatAddress from '../../utils/formatAddress'

it.each([
  ['bc1qmkv9wumjy2yzgghf2jmuvzvua6hgauh5grnm59', 'bc1qmk...grnm59'],
  ['bc1qexasackdmnfpslk8ncmlcprjqqcvzgkrdu5q6y', 'bc1qex...du5q6y'],
  ['bc1q0xnppfz2merk59zcxsuqc7h0lkaw4ycts9y0nu', 'bc1q0x...s9y0nu'],
  ['bc1qhyv7a33zq57nld3hpunk25hkfxfey3rpjxctcn', 'bc1qhy...jxctcn'],
  ['bc1qh4hluzu3d3egwgwdk03xy8xrszd4q7vehttfww', 'bc1qh4...httfww'],
  ['0x3249d704a6a80731d990857E54D8222916B1C161', '0x3249...B1C161'],
])('format %s', (address, expected) => {
  expect(formatAddress(address)).toEqual(expected)
})
