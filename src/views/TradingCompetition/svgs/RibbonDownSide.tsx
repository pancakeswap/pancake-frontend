import React from 'react'
import { Svg, SvgProps } from '@pancakeswap-libs/uikit'

const RibbonDownSide: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 32 64" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5013 64C4.65815 64 -0.670819 58.0604 0.0686475 51.2573C0.423944 47.9886 2.12624 45.1636 4.58664 43.3108C5.51702 42.6101 6.24525 41.6322 6.40046 40.4779C6.56956 39.2203 6.02972 37.9944 5.19007 37.043C3.15098 34.7325 2.04171 31.6093 2.38086 28.2932C2.97882 22.4464 7.90322 18 13.7805 18H18.4336V64H11.5013Z"
        fill="#3B2070"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5013 62C4.65815 62 -0.670819 56.0604 0.0686475 49.2573C0.423944 45.9886 2.12624 43.1636 4.58664 41.3108C5.51702 40.6101 6.24525 39.6322 6.40046 38.4779C6.56956 37.2203 6.02972 35.9944 5.19007 35.043C3.15098 32.7325 2.04171 29.6093 2.38086 26.2932C2.97882 20.4464 7.90322 16 13.7805 16H18.4336V62H11.5013Z"
        fill="#5E38AA"
      />
      <path d="M18 16H28V59C28 61.7614 25.7614 64 23 64H18V16Z" fill="#5E38AA" />
      <path d="M16.0151 17.7998C14.9409 8.31101 22.4506 0 32 0V46L20 53L16.0151 17.7998Z" fill="#7645D9" />
      <path
        d="M20 51C20 48.2386 22.2386 46 25 46H28C28 46 30 49.5 30 56H25C22.2386 56 20 53.7614 20 51Z"
        fill="#4E2F8C"
      />
      <path fillRule="evenodd" clipRule="evenodd" d="M26 56H30V60C30 57.7909 28.2091 56 26 56Z" fill="#4E2F8C" />
      <path fillRule="evenodd" clipRule="evenodd" d="M27 46H20V53C20 49.134 23.134 46 27 46Z" fill="#7645D9" />
      <path d="M27 47C23.6863 47 21 49.6863 21 53" stroke="#3B2070" strokeWidth="2" />
      <path d="M27 57C28.1046 57 29 57.8954 29 59" stroke="#3B2070" strokeWidth="2" />
      <path d="M25 57C22.7909 57 21 55.2091 21 53" stroke="#3B2070" strokeWidth="2" />
      <path d="M29 59C29 61.2091 27.2091 63 25 63L18 63" stroke="#3B2070" strokeWidth="2" />
      <rect x="27" y="46" width="5" height="2" fill="#3B2070" />
      <rect x="25" y="56" width="2" height="2" fill="#3B2070" />
      <path d="M20 12C20 5.37258 25.3726 -2.89694e-07 32 0L32 12L20 12Z" fill="#7645D9" />
    </Svg>
  )
}

export default RibbonDownSide
