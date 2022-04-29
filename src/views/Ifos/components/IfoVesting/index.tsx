import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Box, Card, CardBody, CardHeader, Flex, Text, Image } from '@pancakeswap/uikit'
import NotTokens from './NotTokens'

const StyleVertingCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 24px 0 0 0;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 350px;
    margin: -22px 12px 0 12px;
  }
`

const IfoVesting: React.FC = () => {
  const { t } = useTranslation()

  return (
    <StyleVertingCard isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <Box ml="8px">
            <Text fontSize="24px" color="secondary" bold>
              {t('IFO Vesting Tokens')}
            </Text>
            <Text color="textSubtle" fontSize="14px">
              {t('You have no tokens available for claiming')}
            </Text>
          </Box>
          <Image
            ml="8px"
            width={64}
            height={64}
            alt="ifo-vesting-status"
            style={{ minWidth: '64px' }}
            src="/images/ifos/vesting/not-tokens.svg"
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <NotTokens />
      </CardBody>
    </StyleVertingCard>
  )
}

export default IfoVesting
