import { Box, Message, Flex, Text, InfoFilledIcon } from '@pancakeswap/uikit'
import { SpaceProps } from 'styled-system'
import Link from 'next/link'
import { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  action?: ReactNode
  title?: ReactNode
  content?: ReactNode
} & SpaceProps

export const LinkTitle = styled(Link)`
  font-weight: bold;
  font-size: 0.875rem;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.warning};
`

export const ContentText = styled(Text)`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 0.875rem;
`

export function WarningTips({ action, title, content, ...props }: Props) {
  return (
    <Message
      p="8px"
      variant="warning"
      action={action}
      icon={<InfoFilledIcon width={20} height={20} color="warning" />}
      {...props}
    >
      <Flex flexDirection="column" mb="0.625rem">
        {title}
        <Box mt="0.25rem">{content}</Box>
      </Flex>
    </Message>
  )
}
