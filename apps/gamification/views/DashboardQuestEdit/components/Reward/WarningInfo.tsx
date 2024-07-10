import { useTranslation } from '@pancakeswap/localization'
import { ChevronDownIcon, ChevronUpIcon, Flex, Message, MessageText, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'

const StyledLineClamp = styled(Text)<{ line?: number }>`
  display: -webkit-box;
  white-space: initial;
  -webkit-line-clamp: ${({ line }) => line ?? 1};
  -webkit-box-orient: vertical;
`

export const WarningInfo = () => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Message variant="warning" mb="24px">
      <MessageText overflow="hidden">
        <Text bold>{t('No withdraw allowed')}</Text>
        <StyledLineClamp line={isExpanded ? 0 : 3} ellipsis lineHeight="150%">
          {t(
            `You won't be able to withdraw the reward at any point. Please make absolutely sure the amount you're sending is the one you're satisfied with. We designed the reward distribution smart contract this way so that all users can be confident they will receive the reward they are eligible for.`,
          )}
        </StyledLineClamp>
        <Flex mt="4px" onClick={() => setIsExpanded(!isExpanded)}>
          <Text fontSize="12px" bold color="warning">
            {isExpanded ? t('Hide') : t('Details')}{' '}
          </Text>
          {isExpanded ? (
            <ChevronUpIcon width="18px" color="warning" />
          ) : (
            <ChevronDownIcon width="18px" color="warning" />
          )}
        </Flex>
      </MessageText>
    </Message>
  )
}
