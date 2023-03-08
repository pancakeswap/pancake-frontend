import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'

export const ActionContent = styled(Flex)`
  width: 100%;
  justify-content: space-between;
`

export const ActionTitles = styled(Flex)`
  margin-bottom: 8px;
`

export const ActionContainer = styled(Flex)`
  width: 100%;
  padding: 0 16px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 0;
    padding: 22px;
    flex-direction: row;
    margin-left: 12px;
  }

  > ${ActionTitles}, > ${ActionContent} {
    padding: 16px 0;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }

    ${({ theme }) => theme.mediaQueries.xl} {
      padding: 0 22px;
    }
  }

  ${ActionContent} {
    border-bottom: 2px solid ${({ theme }) => theme.colors.input};

    &:last-child {
      border: 0;
    }

    ${({ theme }) => theme.mediaQueries.xl} {
      border-bottom: 0;
      border-right: 2px solid ${({ theme }) => theme.colors.input};
    }
  }
`
