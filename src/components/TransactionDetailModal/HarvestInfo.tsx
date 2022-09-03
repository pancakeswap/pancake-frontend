import { Flex, Box, WarningIcon, Text, useTooltip, InfoIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'

const ListStyle = styled.div`
  position: relative;
  margin-bottom: 4px;
  padding-left: 8px;

  &:before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0px;
    width: 4px;
    height: 4px;
    background-color: white;
    border-radius: 50%;
  }

  &:last-child {
    margin-bottom: 0px;
  }
`

const LinkStyle = styled(Link)`
  display: inline-block;
  color: white;
  text-decoration: underline;
`

const HarvestPending = () => {
  const { t } = useTranslation()
  return (
    <Box>
      <Box mb="10px">
        <Text bold as="span">
          1.802 CAKE
        </Text>
        <Text as="span" ml="4px">
          {t('Claiming...')}
        </Text>
      </Box>
      <Box mb="24px">
        <Text as="span">{t('You will be receiving')}</Text>
        <Text bold as="span" m="0 4px">
          0.005 BNB
        </Text>
        <Text as="span">{t('as first-time BNB chain user..')}</Text>
      </Box>
    </Box>
  )
}

const HarvestResult = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Flex flexDirection="column">
      <ListStyle>You have received 0.0005 BNB as a first-time BNB Smart Chain user</ListStyle>
      <ListStyle>
        You can swap more BNB on <LinkStyle href="/swap">Swap.</LinkStyle>
      </ListStyle>
      <ListStyle>
        Explore more features like <LinkStyle href="/pools?chainId=56">Pools</LinkStyle> and{' '}
        <LinkStyle href="/prediction?chainId=56">Win</LinkStyle> with your CAKE earned.
      </ListStyle>
    </Flex>,
    { placement: 'top' },
  )

  return (
    <Box mb="24px">
      <Box>
        <Text bold as="span">
          1.802 CAKE
        </Text>
        <Text as="span" ml="4px">
          {t('have been earned to your Wallet!')}
        </Text>
      </Box>
      {/* <Flex>
        <Box display="inline-flex">
          <Text bold as="span">1.802 CAKE</Text>
          <Text as="span" m="0 4px">{t('with')}</Text>
          <Text bold as="span">0.005 BNB</Text>
          {tooltipVisible && tooltip}
          <Box ml="2px" ref={targetRef}>
            <InfoIcon color="primary" />
          </Box>
        </Box>
      </Flex>
      <Text>{t('have been earned to your Wallet!')}</Text> */}
    </Box>
  )
}

const HarvestError = () => {
  const { t } = useTranslation()
  return (
    <Flex mb="24px">
      <WarningIcon color="failure" style={{ alignSelf: 'flex-start' }} />
      <Box ml="4px">
        <Text as="span" bold>
          1.802 CAKE
        </Text>
        <Text as="span" ml="4px">
          harvest is failed due to x, y, z (shows generic potential reasons here
        </Text>
      </Box>
    </Flex>
  )
}

const HarvestInfo = () => {
  return (
    <>
      <HarvestPending />
      {/* <HarvestResult /> */}
      {/* <HarvestError /> */}
    </>
  )
}

export default HarvestInfo
