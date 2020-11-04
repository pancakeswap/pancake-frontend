import React from 'react'

const CoreIcon = () => (
  <svg width="16" height="16" fill="none">
    <mask
      id="CoreIcon"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="16"
      height="16"
    >
      <path
        d="M15.333 8l-1.627-1.86.227-2.46-2.407-.547L10.267 1 8 1.973 5.733 1l-1.26 2.127-2.407.54.227 2.467L.667 8l1.627 1.86-.227 2.467 2.407.547L5.733 15 8 14.02l2.267.973 1.26-2.127 2.407-.547-.227-2.46L15.333 8zm-9.08 2.673l-1.587-1.6c-.26-.26-.26-.68 0-.94l.047-.047a.67.67 0 0 1 .947 0l1.073 1.08 3.433-3.44a.67.67 0 0 1 .947 0l.047.047c.26.26.26.68 0 .94l-3.947 3.96c-.273.26-.693.26-.96 0z"
        fill="#323232"
      />
    </mask>
    <g mask="url(#CoreIcon)">
      <path fill="currentColor" d="M0 0h16v16H0z" />
    </g>
  </svg>
)

export default CoreIcon
