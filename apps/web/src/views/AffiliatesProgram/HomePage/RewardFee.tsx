import styled from 'styled-components'
import { Flex, Text, Button, Box, Card, PageSection, ArrowUpDownIcon, TimerIcon } from '@pancakeswap/uikit'
import { useTranslation, Trans } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  > img {
    position: absolute;
  }

  & :nth-child(1) {
    left: 20%;
    top: 5%;
    animation: ${floatingStarsLeft} 3s ease-in-out infinite;
  }
  & :nth-child(2) {
    left: 0;
    bottom: 5%;
    animation: ${floatingStarsRight} 3.5s ease-in-out infinite;
  }
  & :nth-child(3) {
    right: 10%;
    top: 5%;
    animation: ${floatingStarsRight} 4s ease-in-out infinite;
  }
  & :nth-child(4) {
    right: 0;
    top: 15%;
    animation: ${floatingStarsLeft} 6s ease-in-out infinite;
  }
  & :nth-child(5) {
    right: 10%;
    bottom: 5%;
    animation: ${floatingStarsRight} 6s ease-in-out infinite;
  }
}`

const RewardList = [
  {
    title: <Trans>V2/V3 Swap & StableSwap</Trans>,
    percentage: '3%',
    icon: () => <ArrowUpDownIcon color="primary" style={{ transform: 'rotate(90deg)' }} width={32} height={32} />,
  },
  {
    title: <Trans>Perpetual</Trans>,
    percentage: '20%',
    icon: () => <TimerIcon color="failure" width={32} height={32} />,
  },
  // {
  //   title: <Trans>Lottery & Pottery</Trans>,
  //   percentage: '3%',
  //   icon: () => <TicketFillIcon color="secondary" width={32} height={32} />
  // },
  // {
  //   title: <Trans>Prediction</Trans>,
  //   percentage: '3%',
  //   icon: () => <PredictionsIcon color="primary" width={32} height={32} />
  // }
]

const RewardFee = () => {
  const { theme } = useTheme()

  return (
    <PageSection
      position="relative"
      background={theme.colors.gradientBubblegum}
      concaveDivider
      clipFill={{ light: theme.colors.gradientBubblegum }}
      dividerPosition="top"
      index={2}
    >
      <Decorations>
        <img src="/images/affiliates-program/m-1.png" width="110px" height="79px" alt="" />
        <img src="/images/affiliates-program/m-2.png" width="295.89px" height="226px" alt="" />
        <img src="/images/affiliates-program/m-3.png" width="42px" height="29px" alt="" />
        <img src="/images/affiliates-program/m-4.png" width="210px" height="210px" alt="" />
        <img src="/images/affiliates-program/m-5.png" width="72px" height="63px" alt="" />
      </Decorations>
      <Flex justifyContent={['column', 'row']}>
        <Flex flexDirection="column" mr={['48px']} alignSelf={['center']}>
          {RewardList.map((list, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={`reward-list-${index}`} mb={['16px']}>
              <Card>
                <Flex width={['390px']} flexDirection="column" padding="16px">
                  <Flex justifyContent="space-between">
                    <Text fontSize={['40px']} bold color="secondary">
                      {list.percentage}
                    </Text>
                    {list.icon()}
                  </Flex>
                  <Text bold fontSize={['20px']} textAlign="right">
                    {list.title}
                  </Text>
                </Flex>
              </Card>
            </Box>
          ))}
        </Flex>
        <Flex width={['447px']} alignSelf={['center']} flexDirection="column">
          <Text fontSize={['20px']} color="secondary">
            Commission structure
          </Text>
          <Text fontSize={['40px']} lineHeight="110%" color="body" bold m={['32px 0']}>
            Receive monthly revenue for every user you bring to the platform
          </Text>
          <Text color="textSubtle" mb="32px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </Text>
          <Button width="fit-content">Apply now!</Button>
        </Flex>
      </Flex>
    </PageSection>
  )
}

export default RewardFee
