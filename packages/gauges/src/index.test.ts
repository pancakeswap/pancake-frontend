import { expect, test } from 'vitest'
import * as namedExports from './index'

test('exports', () => {
  expect(Object.keys(namedExports)).toMatchInlineSnapshot(`
    [
      "calcGaugesVotingABI",
      "gaugesVotingABI",
      "GAUGES_SUPPORTED_CHAIN_IDS",
      "GAUGES_ADDRESS",
      "GAUGES_CALC_ADDRESS",
      "getAllGauges",
      "getGaugesByChain",
      "safeGetGaugesByChain",
      "GaugeType",
      "GAUGE_TYPE_NAMES",
    ]
  `)
})
