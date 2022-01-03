import React from 'react'
import styled from 'styled-components'
import NextLink from 'next/link'
import { LinkProps } from 'react-router-dom'

const A = styled.a``

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = ({ to, children, ...props }: LinkProps) => (
  <NextLink href={to as string}>
    <A {...props}>{children}</A>
  </NextLink>
)
