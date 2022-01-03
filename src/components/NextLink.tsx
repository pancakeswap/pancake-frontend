import React, { forwardRef } from 'react'
import styled from 'styled-components'
import NextLink from 'next/link'
import { LinkProps } from 'react-router-dom'

const A = styled.a``

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(({ to, replace, children, ...props }, ref) => (
  <NextLink href={to as string} replace={replace}>
    <A ref={ref} {...props}>
      {children}
    </A>
  </NextLink>
))
