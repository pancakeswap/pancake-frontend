import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, CardHeader, Heading, Text, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import FoldableText from 'components/FoldableText'

const Wrapper = styled(Flex)`
  margin-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    margin-top: 0px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex: 2;
  }
`

const StyledCardbody = styled(CardBody)`
  div:first-child {
    margin-top: 0px;
  }
`

const FAQ = () => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Card>
        <CardHeader>
          <Heading size="lg">Details</Heading>
        </CardHeader>
        <StyledCardbody>
          <FoldableText title={TranslateString(999, 'Eligible trading pairs')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {TranslateString(
                999,
                'Only trades on BNB/BUSD, CAKE/BNB, ETH/BNB and BTCB/BNB pairs will be included in volume calculations.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'Calculating team ranks and winners')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              -{' '}
              {TranslateString(
                999,
                'Team ranks are calculated by the total combined volume of the top 500 members of each respective team.',
              )}
            </Text>
            <Text fontSize="14px" color="textSubtle">
              -{' '}
              {TranslateString(
                999,
                'The final winning team will be the team with the highest total combined volume of their top 500 members at the end of the competition period.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'Prize distribution')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              -{' '}
              {TranslateString(
                999,
                'Prizes to be distributed in CAKE and shared by all members of each respective tier as per the Prizes section above.',
              )}
            </Text>
            <Text fontSize="14px" color="textSubtle">
              -{' '}
              {TranslateString(
                999,
                'CAKE prizes will be distributed as per the CAKE/BUSD price on the day of distribution. Every eligible participant will win prizes at the end of the competition.',
              )}
            </Text>
            <Text fontSize="14px" color="textSubtle">
              - {TranslateString(999, 'Every participant will win at least one prize at the end of the competition')}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'Fine print')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              -{' '}
              {TranslateString(
                999,
                'In the event of a disagreement concerning the final winning team or rank, PancakeSwap will have the final say.',
              )}
            </Text>
            <Text fontSize="14px" color="textSubtle">
              -{' '}
              {TranslateString(
                999,
                'PancakeSwap can and will disqualify any team or specific members that are proven to have taken malicious action or attempt to “cheat” in any way.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'Can I join the battle after it starts?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {TranslateString(
                999,
                'Sorry, no. You need to register during the registration period, before the start of the event.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'How do I know if I successfully registered?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {TranslateString(
                999,
                'At the top of the page, the text in the button “I Want to Battle” will change to “Registered”.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'How can I see my current rank?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {TranslateString(
                999,
                'Check the Your Score section on the event page. You’ll need to connect your wallet, of course.',
              )}
            </Text>
          </FoldableText>
          <FoldableText title={TranslateString(999, 'How do I claim my prize(s)?')} mt="24px">
            <Text fontSize="14px" color="textSubtle">
              {TranslateString(
                999,
                'After the battle ends, visit the event page and click the “Claim Prizes” button in the top section or in the “Your Score” section. Once you claim your prizes successfully, the button text will change to “Prizes Claimed”.',
              )}
            </Text>
          </FoldableText>
        </StyledCardbody>
      </Card>
    </Wrapper>
  )
}

export default FAQ
