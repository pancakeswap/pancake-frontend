import { ReactElement } from 'react'
import { Box, Flex, HelpIcon, CardHeader, CardBody, Text, useTooltip } from '@pancakeswap/uikit'

import { StyledCard } from '../IfoCardStyles'
import { CardConfigReturn } from './types'

interface GenericIfoCardElements {
  action: ReactElement
  content: ReactElement
}

const GenericIfoCard: React.FC<CardConfigReturn & GenericIfoCardElements> = ({
  title,
  variant,
  action,
  content,
  tooltip,
}) => {
  const { targetRef, tooltip: tooltipMsg, tooltipVisible } = useTooltip(tooltip, { placement: 'bottom' })

  return (
    <>
      {tooltipVisible && tooltipMsg}
      <StyledCard>
        <CardHeader p="16px 24px" variant={variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px" lineHeight={1}>
              {title}
            </Text>
            {tooltip && (
              <div ref={targetRef} style={{ display: 'flex', marginLeft: '8px' }}>
                <HelpIcon />
              </div>
            )}
          </Flex>
        </CardHeader>
        <CardBody p="24px">
          <Flex flexDirection="column" justifyContent="center" alignItems="center">
            {content}
            <Box width="100%" mt="24px">
              {action}
            </Box>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default GenericIfoCard
