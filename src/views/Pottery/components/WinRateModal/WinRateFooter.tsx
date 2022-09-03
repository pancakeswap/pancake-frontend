import { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, ExpandableLabel, Grid } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const Footer = styled(Flex)`
  width: 100%;
  background: ${({ theme }) => theme.colors.dropdown};
`

const BulletList = styled.ul`
  list-style-type: none;
  margin-top: 16px;
  padding: 0;
  li {
    margin: 0;
    padding: 0;
  }
  li::before {
    content: '•';
    margin-right: 4px;
    color: ${({ theme }) => theme.colors.textSubtle};
  }
  li::marker {
    font-size: 12px;
  }
`

interface WinRateFooterProps {
  apy: number
}

const WinRateFooter: React.FC<React.PropsWithChildren<WinRateFooterProps>> = ({ apy }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()

  return (
    <Footer p="16px" flexDirection="column">
      <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)}>
        {isExpanded ? t('Hide') : t('Details')}
      </ExpandableLabel>
      {isExpanded && (
        <Box px="8px">
          <Grid gridTemplateColumns="2.5fr 1fr" rowGap="8px" gridTemplateRows={`repeat(${2}, auto)`}>
            <Text color="textSubtle" small>
              {t('APY')}
            </Text>
            <Text small textAlign="right">
              {apy.toFixed(2)}%
            </Text>
          </Grid>
          <BulletList>
            <li>
              <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
                {t('Calculated based on current rates.')}
              </Text>
            </li>
            <li>
              <Text fontSize="12px" textAlign="center" color="textSubtle" display="inline" lineHeight={1.1}>
                {t(
                  'All figures are estimates provided for your convenience only, and by no means represent guaranteed returns. Rates are subject to frequent, large changes.',
                )}
              </Text>
            </li>
          </BulletList>
        </Box>
      )}
    </Footer>
  )
}

export default WinRateFooter
