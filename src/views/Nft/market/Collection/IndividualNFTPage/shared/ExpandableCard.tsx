import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Grid, Text, Card, Box, ChevronUpIcon, ChevronDownIcon, IconButton } from '@tovaswapui/uikit'
import useTheme from 'hooks/useTheme'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 720px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 710px;
  }
  to {
    max-height: 0px;
  }
`

const ExpandableCardBody = styled(Box)<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
`

const FullWidthCard = styled(Card)`
  width: 100%;
`

interface ExpandableCardProps {
  icon: React.ReactNode
  title: string
  content: React.ReactNode
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ icon, title, content }) => {
  const [expanded, setExpanded] = useState(true)
  const { theme } = useTheme()
  return (
    <FullWidthCard>
      <Grid
        gridTemplateColumns="1fr 8fr 1fr"
        alignItems="center"
        height="72px"
        px="24px"
        borderBottom={`1px solid ${theme.colors.cardBorder}`}
      >
        {icon}
        <Text bold>{title}</Text>
        <IconButton
          onClick={() => {
            setExpanded((prev) => !prev)
          }}
          variant="text"
          maxWidth="32px"
        >
          {expanded ? (
            <ChevronUpIcon width="24px" height="24px" color="textSubtle" />
          ) : (
            <ChevronDownIcon width="24px" height="24px" color="textSubtle" />
          )}
        </IconButton>
      </Grid>
      <ExpandableCardBody expanded={expanded}>{content}</ExpandableCardBody>
    </FullWidthCard>
  )
}

export default ExpandableCard
