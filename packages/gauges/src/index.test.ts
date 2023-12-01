import { expect, test } from 'vitest'
import * as namedExports from './index'

test('exports', () => {
  expect(Object.keys(namedExports)).toMatchInlineSnapshot(`
    [
      "GAUGES_ADDRESS",
      "CONFIG_TESTNET",
      "CONFIG_PROD",
      "GAUGES_CONFIG",
      "getAllGauges",
      "GaugeType",
      "GAUGE_TYPE_NAMES",
    ]
  `)
})
