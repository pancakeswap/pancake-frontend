import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Heading,
  NextLinkFromReactRouter,
  PageHeader,
  Text,
} from '@pancakeswap/uikit'
import { NewCakeStakingCard } from './components/NewCakeStakingCard'

const CakeStaking = () => {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Cake Staking')}
            </Heading>
            <Box maxWidth="537px">
              <Text color="textSubtle">
                {t(
                  'Enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
                )}
              </Text>
            </Box>
            {/* @todo: @ChefJerry add link */}
            <NextLinkFromReactRouter to="/tbd" prefetch={false}>
              <Button p="0" variant="text">
                <Text color="primary" bold fontSize="16px" mr="4px">
                  {t('Get CAKE')}
                </Text>
                <ArrowForwardIcon color="primary" />
              </Button>
            </NextLinkFromReactRouter>
          </Flex>

          <Box>
            <NewCakeStakingCard />
          </Box>
        </Flex>
      </PageHeader>
    </>
  )
}

export default CakeStaking
