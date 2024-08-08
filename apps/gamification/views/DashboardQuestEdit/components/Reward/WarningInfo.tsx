import { useTranslation } from '@pancakeswap/localization'
import { Box, ChevronDownIcon, ChevronUpIcon, ErrorIcon, Flex, Message, MessageText, Text } from '@pancakeswap/uikit'
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
    <Box mb="24px">
      <Message variant="success" icon={<ErrorIcon width="24px" color="primary" />}>
        <MessageText overflow="hidden">
          <Text bold>{t('No withdraw allowed')}</Text>
          <StyledLineClamp fontSize="14px" line={isExpanded ? 0 : 3} ellipsis lineHeight="150%">
            {t(
              `Once submitted, rewards cannot be withdrawn. Please verify the amount before sending, as it cannot be adjusted later. Our smart contract ensures accurate reward distribution, providing confidence to all users in receiving their eligible rewards.`,
            )}
          </StyledLineClamp>
          <Flex mt="4px" onClick={() => setIsExpanded(!isExpanded)}>
            <Text fontSize="12px" bold color="success">
              {isExpanded ? t('Hide') : t('Details')}{' '}
            </Text>
            {isExpanded ? (
              <ChevronUpIcon width="18px" color="success" />
            ) : (
              <ChevronDownIcon width="18px" color="success" />
            )}
          </Flex>
        </MessageText>
      </Message>
      <Message variant="success" mt="8px" icon={<ErrorIcon width="24px" color="success" />}>
        <MessageText>
          <Text fontSize="14px">
            {t('You won’t be able to change the timeline or the tasks after adding a reward.')}
          </Text>
        </MessageText>
      </Message>
    </Box>
  )
}
