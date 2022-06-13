import styled from 'styled-components'
import { Flex, Box, Text, Grid } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

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

const WinRateFooter: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Footer p="16px" flexDirection="column">
      <Box px="8px">
        <Grid gridTemplateColumns="2.5fr 1fr" gridRowGap="8px" gridTemplateRows={`repeat(${2}, auto)`}>
          <>
            <Text color="textSubtle" small>
              {t('APR')}
            </Text>
            <Text small textAlign="right">
              120.234%
            </Text>
          </>
          <>
            <Text color="textSubtle" small>
              {t('APY (%compoundTimes%x daily compound)', {
                compoundTimes: 1,
              })}
            </Text>
            <Text small textAlign="right">
              120.234%
            </Text>
          </>
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
    </Footer>
  )
}

export default WinRateFooter
