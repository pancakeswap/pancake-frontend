import React from 'react'
import Tag from './Tag'

const Icon = () => (
  <svg width="16" height="16" fill="none">
    <mask
      id="A"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="16"
      height="16"
    >
      <path
        d="M8 8.5c1.087 0 2.047.26 2.827.6A1.99 1.99 0 0 1 12 10.92v.413a.67.67 0 0 1-.667.667H4.667A.67.67 0 0 1 4 11.333v-.407c0-.787.453-1.507 1.173-1.82A6.96 6.96 0 0 1 8 8.5zm-5.333.167A1.34 1.34 0 0 0 4 7.333 1.34 1.34 0 0 0 2.667 6a1.34 1.34 0 0 0-1.333 1.333 1.34 1.34 0 0 0 1.333 1.333zm.753.733c-.247-.04-.493-.067-.753-.067-.66 0-1.287.14-1.853.387A1.34 1.34 0 0 0 0 10.953v.38A.67.67 0 0 0 .667 12H3v-1.073A3 3 0 0 1 3.42 9.4zm9.913-.733a1.34 1.34 0 0 0 1.333-1.333A1.34 1.34 0 0 0 13.333 6 1.34 1.34 0 0 0 12 7.333a1.34 1.34 0 0 0 1.333 1.333zM16 10.953a1.34 1.34 0 0 0-.813-1.233c-.567-.247-1.193-.387-1.853-.387-.26 0-.507.027-.753.067a3 3 0 0 1 .42 1.527V12h2.333a.67.67 0 0 0 .667-.667v-.38zM8 4a2 2 0 1 1 0 4 2 2 0 1 1 0-4z"
        fill="#323232"
      />
    </mask>
    <g mask="url(#A)">
      <path fill="#fff" d="M0 0h16v16H0z" />
    </g>
  </svg>
)

const CommunityTag = () => (
  <Tag variant="pink">
    <Icon />
    <span style={{ marginLeft: '4px' }}>Community</span>
  </Tag>
)

export default CommunityTag
