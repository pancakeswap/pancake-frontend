import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip, Box } from '@rug-zombie-libs/uikit'
import { Pool } from 'state/types'
import { CompoundingPoolTag, CoreTag, ManualPoolTag } from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'
import { GraveConfig } from '../../../../../config/constants/types'

interface FooterProps {
  account: string
  grave: GraveConfig
  userData: any
  totalZombieInGrave?: BigNumber
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const Footer: React.FC<FooterProps> = ({
  account,
  grave,
  userData,
  totalZombieInGrave,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const manualTooltipText = t('Tokens are locked for the staking period.')


  const { targetRef, tooltip, tooltipVisible } = useTooltip( manualTooltipText, {
    placement: 'bottom-end',
  })

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {tooltipVisible && tooltip}
          <Box ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Box>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedFooter
          grave={grave}
          account={account}
          totalZombieInGrave={totalZombieInGrave}
        />
      )}
    </CardFooter>
  )
}

export default Footer
