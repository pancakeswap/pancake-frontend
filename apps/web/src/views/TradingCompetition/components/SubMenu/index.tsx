import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Flex } from '@pancakeswap/uikit'

const Container = styled(Flex)<{ isOnFinishedPage: boolean }>`
  gap: 8px;

  a {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  a:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  ${({ isOnFinishedPage, theme }) =>
    isOnFinishedPage
      ? `
    a:last-child {
      color: ${theme.colors.secondary};
      font-weight: 600;
      border-bottom: 2px solid ${theme.colors.primary};
    }
  `
      : `
      a:first-child {
        color: ${theme.colors.secondary};
        font-weight: 600;
        border-bottom: 2px solid ${theme.colors.primary};
      }`}
`

const SubMenu: React.FC = () => {
  const { pathname } = useRouter()
  const isOnFinishedPage = pathname.includes('finished')
  return (
    <Container my="16px" width="100%" justifyContent="center" isOnFinishedPage={isOnFinishedPage}>
      <Link href="/competition">Latest</Link>
      <Link href="/competition/finished">Finished</Link>
    </Container>
  )
}

export default SubMenu
