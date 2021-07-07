import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledCard = styled(Card)`
  flex: 1;
`

const List = styled.ul`
  list-style-position: outside;
  padding: 0 24px;

  li {
    line-height: 1.5;
    margin-bottom: 4px;
  }

  li::marker {
    font-size: 12px;
  }
`

const FAQs = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Heading as="h1" scale="xxl" mb="40px">
        {t('FAQs')}
      </Heading>
      <Flex flexDirection={['column', null, null, 'row']}>
        <StyledCard mr={[null, null, null, '24px']} mb={['24px', null, null, '0']}>
          <CardHeader>
            <Heading>{t('How does it work?')}</Heading>
          </CardHeader>
          <CardBody>ssss</CardBody>
        </StyledCard>
        <StyledCard>
          <CardHeader>
            <Heading>{t('Terms & Conditions')}</Heading>
          </CardHeader>
          <CardBody>
            <Flex flexDirection="column">
              <Text mb="4px">
                {t('By participating in an Community Farm Auction, you agree to the following terms.')}
              </Text>
              <List>
                <li>
                  {t(
                    'A project being whitelisted for participation in an auction by PancakeSwap is in no way an endorsement or recommendation about said project.',
                  )}
                </li>
                <li>
                  {t('PancakeSwap strongly advise against sending funds to any projects which request donations.')}
                </li>
                <li>
                  {t(
                    'PancakeSwap reserves all rights to remove any project it deems to have acted with malicious or dangerous intent from auctions at any time.',
                  )}
                </li>
              </List>
            </Flex>
          </CardBody>
        </StyledCard>
      </Flex>
    </Flex>
  )
}

export default FAQs
