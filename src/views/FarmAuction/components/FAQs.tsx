import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex, Link, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableText'
import { FORM_ADDRESS } from '../helpers'

const StyledCard = styled(Card)`
  flex: 1;
  height: fit-content;
`

const InlineLink = styled(Link)`
  display: inline;
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

const FaqLi = styled.li`
  color: ${({ theme }) => theme.colors.textSubtle};
`

const FAQs = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Heading color="#280D5F" as="h1" scale="xxl" mb="40px">
        {t('FAQs')}
      </Heading>
      <Flex flexDirection={['column', null, null, null, 'row']}>
        <StyledCard mr={[null, null, null, null, '24px']} mb={['24px', null, null, null, '0']}>
          <CardHeader>
            <Heading>{t('How does it work?')}</Heading>
          </CardHeader>
          <CardBody p="0 24px 24px">
            <FoldableText title={t('Step 1: Submit application')} mt="24px">
              <Box display="inline">
                <Text display="inline" color="textSubtle">
                  {t('Projects can submit an application to sponsor a yield farm and/or pool on PancakeSwap via the ')}
                </Text>
                <InlineLink href={FORM_ADDRESS} external>
                  {t('Application Form')}
                </InlineLink>
              </Box>
            </FoldableText>
            <FoldableText title={t('Step 2: Await whitelisting')} mt="24px">
              <Box color="textSubtle">
                <Text color="textSubtle" mb="4px">
                  {t('The PancakeSwap team will try to respond within a week.')}
                </Text>
                <List>
                  <FaqLi>
                    {t(
                      'Community Farm qualifiers will be asked to provide the address of the wallet which you’ll use for bidding CAKE in the auction.',
                    )}
                  </FaqLi>
                  <FaqLi>{t('Core Farm/Pool qualifiers will receive further directions separately.')}</FaqLi>
                </List>
              </Box>
            </FoldableText>
            <FoldableText title={t('Step 3: During the auction')} mt="24px">
              <Text color="textSubtle">
                {t(
                  'During the auction period, if you connect your project’s whitelisted wallet to the Auction page, you’ll see a “Place Bid” button during when the auction is live.',
                )}
              </Text>
              <Text color="textSubtle">
                {t(
                  'You can then commit CAKE to bid during the auction, competing against other project for one of the available farms.',
                )}
              </Text>
            </FoldableText>
            <FoldableText title={t('Step 4: After the auction')} mt="24px">
              <Text color="textSubtle">
                {t('If your bid was not successful, you can reclaim your CAKE on this page.')}
              </Text>
              <Text color="textSubtle">
                {t(
                  'If your bid was successful, your farm will begin at the specified time. The CAKE you bid will not be returned to you and will be added to our weekly CAKE burn.',
                )}
              </Text>
              <Text color="textSubtle">
                {t('So long as you are whitelisted, you’ll be able to participate in each new auction.')}
              </Text>
              <Text color="textSubtle">
                {t(
                  'If two or more projects bid the exact same CAKE amount and are contending for a spot in the winning bidders, their bids may be invalidated.',
                )}
              </Text>
            </FoldableText>
          </CardBody>
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
