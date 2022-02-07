import React from 'react'
import { Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Twitter from './Icons/Twitter'

export const AppFooter = () => {
  return (
    <>
      <div
        style={{
          height: 100,
          background: '#27262a',
          marginBottom: -40,
          padding: '60px 40px 0px 40px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            borderBottom: '1px solid #757575',
          }}
        >
          <a href="www.twitter.com" className="myClass">
            <Twitter color="#7A6EAA" height={30} width={30} />
          </a>
          <Text color="turquoise" fontFamily="Super Tasty">
            SpacePies
          </Text>
        </div>
      </div>
      <div className="site-logo">
        <Text color="turquoise">SpacePies</Text>
      </div>
      <a href="www.safemoon.net" target="_blank" className="buy-safemoon-btn">
        Buy Safemoon
      </a>
    </>
  )
}
