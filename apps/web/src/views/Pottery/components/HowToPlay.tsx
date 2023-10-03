import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex, Text, Card, Box } from '@pancakeswap/uikit'
import Divider from 'components/Divider'

const HowToPlayContainer = styled(Flex)`
  width: 100%;
  margin: auto;
  padding: 48px 24px 0 24px;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 1140px;
    padding-top: 56px;
  }
`

const CardContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const CardStyle = styled(Card)`
  width: 100%;
  margin: 0 0 24px 0;
  &:last-child {
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: calc(33.33% - 16px);
    margin: 0 24px 0 0;
    &:last-child {
      margin-right: 0;
    }
  }
`

type Step = { title: string; subtitle: string; label: string }

const HowToPlay: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const steps: Step[] = [
    {
      label: t('Step %number%', { number: 1 }),
      title: t('Deposit CAKE'),
      subtitle: t(
        'Deposit CAKE on the monthly subscription date -- first Monday of each Month. Your chance of winning depends on how many CAKE you deposit compared to the total pool. Your CAKE deposit will be locked for 10 weeks. There will be a monthly TVL cap in the beta product stage.',
      ),
    },
    {
      label: t('Step %number%', { number: 2 }),
      title: t('Wait for the Draw'),
      subtitle: t(
        'A portion of the staking rewards from the CAKE deposited will fill the prize pot and there will be one weekly draw. There will be eight (8) winners each week. Check your chance of winning, add more CAKE on the monthly subscription date to increase your odds!',
      ),
    },
    {
      label: t('Step %number%', { number: 3 }),
      title: t('Claim & Withdrawal'),
      subtitle: t(
        "You can claim any winnings that you may have once the weekly draw is completed. Your CAKE can be withdrawn after 10 weeks but they won't be providing any winning odds anymore.",
      ),
    },
  ]

  return (
    <HowToPlayContainer>
      <Text fontSize="40px" mb="24px" color="secondary" bold>
        {t('How to Play')}
      </Text>
      <Text textAlign="center">
        {t(
          'Deposit CAKE to get your Pottery tickets. More CAKE deposited, higher the chance of winning (and of course, higher the rewards)!',
        )}
      </Text>
      <Text mb="40px">{t('Simple!')}</Text>
      <CardContainer>
        {steps.map((step) => (
          <CardStyle key={step.label}>
            <Flex flexDirection="column" padding="24px">
              <Text fontSize="12px" mb="16px" textTransform="uppercase" bold textAlign="right">
                {step.label}
              </Text>
              <Text fontSize="24px" mb="16px" color="secondary" bold>
                {step.title}
              </Text>
              <Text color="textSubtle">{step.subtitle}</Text>
            </Flex>
          </CardStyle>
        ))}
      </CardContainer>
      <Box width="100%" m="40px 0">
        <Divider />
      </Box>
    </HowToPlayContainer>
  )
}

export default HowToPlay
