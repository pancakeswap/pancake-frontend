import { describe, expect, it } from 'vitest'

import { deserialize } from './deserialize'

describe('deserialize', () => {
  it('deserializes', () => {
    const deserializedCache = deserialize(
      JSON.stringify({
        some: 'complex',
        object: {
          that: 'has',
          many: [
            { many: 'many', manymany: 'many' },
            { many: 'many' },
            { many: 'many' },
            {
              many: {
                properties: {
                  ones: {
                    that: {
                      have: {
                        functions: () => null,
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        also: {
          ones: {
            that: {
              have: {
                proxies: new Proxy({ lol: 'nice' }, {}),
              },
            },
          },
        },
      }),
    )
    expect(deserializedCache).toMatchInlineSnapshot(`
      {
        "also": {
          "ones": {
            "that": {
              "have": {
                "proxies": {
                  "lol": "nice",
                },
              },
            },
          },
        },
        "object": {
          "many": [
            {
              "many": "many",
              "manymany": "many",
            },
            {
              "many": "many",
            },
            {
              "many": "many",
            },
            {
              "many": {
                "properties": {
                  "ones": {
                    "that": {
                      "have": {},
                    },
                  },
                },
              },
            },
          ],
          "that": "has",
        },
        "some": "complex",
      }
    `)
  })
})
