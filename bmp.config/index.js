/* eslint-disable */
const path = require('path')
const fs = require('fs')
const loadEnvConfig = require('@next/env').loadEnvConfig

const projectDir = process.cwd()
loadEnvConfig(projectDir)

// const dotenv = require('dotenv')
// const result = dotenv.config({
//   path: path.resolve(process.cwd(), '.env' + (process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : '')),
// })
const envs = Object.keys(process.env).reduce((acc, key) => {
  acc[key] = JSON.stringify(process.env[key])
  return acc
}, {})
const list = fs.readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true }).map((item) => item.name)

const alias = list.reduce((prev, curr) => {
  const key = curr.replace(/\.[^/.]+$/, '')
  prev[key] = path.resolve(`./src/${curr}`)
  return prev
}, {})

module.exports = {
  alias: {
    ...alias,
    qrcode: path.resolve(__dirname, '../node_modules/qrcode/lib/browser.js'),
    keccak: path.resolve(__dirname, '../node_modules/keccak/js.js'),
    secp256k1: path.resolve(__dirname, '../node_modules/secp256k1/elliptic.js'),
    'typo-js': path.resolve(__dirname, './adaptor/typo-js.js'),
    '@pancakeswap/uikit': '@binance/mp-pancake-uikit',
    'styled-components': '@binance/mp-styled',
    'next/router': path.resolve(__dirname, './adaptor/next-router'),
    '@ethersproject/web': path.resolve(__dirname, './adaptor/ethers-web'),
    'redux-localstorage-simple': path.resolve(__dirname, './adaptor/redux-localstorage-simple'),
    'react-window': path.resolve(__dirname, './adaptor/react-window.jsx'),
  },

  entry: {
    app: ['src/app.bmp'],
  },
  env: envs,

  defineConstants: {},
  webpackChain(chain, webpack) {
    chain.merge({
      plugin: {
        provide: {
          plugin: webpack.ProvidePlugin,
          args: [
            {
              fetch: [path.resolve(__dirname, './provider/fetch.js'), 'default'],
              TextDecoder: [path.resolve(__dirname, './provider/textDecoder.js'), 'default'],
            },
          ],
        },
      },
    })
  },
}
