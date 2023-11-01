import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, PageHeader } from '@pancakeswap/uikit'

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
            {/* <Heading scale="md" color="text">
              {t(
                'Enjoy the benefits of weekly CAKE yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
              )}
            </Heading> */}
          </Flex>
        </Flex>
      </PageHeader>
    </>
  )
}

export default CakeStaking
