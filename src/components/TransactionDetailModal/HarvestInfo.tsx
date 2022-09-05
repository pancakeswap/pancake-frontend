import { Flex, Box, WarningIcon, Text, useTooltip, InfoIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
import { HarvestStatusType } from 'state/transactions/actions'
import { TransactionDetails } from 'state/transactions/reducer'

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
  margin: 0 4px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
`

interface HarvestInfoProps {
  pickedData: TransactionDetails
}

const HarvestPending: React.FC<React.PropsWithChildren<HarvestInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { amount, nonce } = pickedData.farmHarvest.sourceChain

  return (
    <Box>
      <Box mb="10px">
        <Text bold as="span">
          {`${amount} CAKE`}
        </Text>
        <Text as="span" ml="4px">
          {t('Claiming...')}
        </Text>
      </Box>
      {nonce === '0' && (
        <Box mb="24px">
          <Text as="span">{t('You will be receiving')}</Text>
          <Text bold as="span" m="0 4px">
            0.005 BNB
          </Text>
          <Text as="span">{t('as first-time BNB chain user..')}</Text>
        </Box>
      )}
    </Box>
  )
}

const HarvestResult: React.FC<React.PropsWithChildren<HarvestInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { nonce, amount } = pickedData.farmHarvest.sourceChain

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Flex flexDirection="column">
      <ListStyle>{t('You have received 0.0005 BNB as a first-time BNB Smart Chain user')}</ListStyle>
      <ListStyle>
        {t('You can swap more BNB on')}
        <LinkStyle href="/swap">{t('Swap.')}</LinkStyle>
      </ListStyle>
      <ListStyle>
        {t('Explore more features like')}
        <LinkStyle href="/pools?chainId=56">{t('Pools')}</LinkStyle>
        {t('and')}
        <LinkStyle href="/prediction?chainId=56">{t('Win')}</LinkStyle>
        {t('with your CAKE earned.')}
      </ListStyle>
    </Flex>,
    { placement: 'top' },
  )

  return (
    <Box mb="24px">
      {nonce === '0' ? (
        <Box>
          <Flex>
            <Box display="inline-flex">
              <Text bold as="span">{`${amount} CAKE`}</Text>
              <Text as="span" m="0 4px">
                {t('with')}
              </Text>
              <Text bold as="span">
                0.005 BNB
              </Text>
              {tooltipVisible && tooltip}
              <Box ml="2px" ref={targetRef}>
                <InfoIcon color="primary" />
              </Box>
            </Box>
          </Flex>
          <Text>{t('have been earned to your Wallet!')}</Text>
        </Box>
      ) : (
        <Box>
          <Text bold as="span">
            {`${amount} CAKE`}
          </Text>
          <Text as="span" ml="4px">
            {t('have been earned to your Wallet!')}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const HarvestError: React.FC<React.PropsWithChildren<HarvestInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { amount } = pickedData.farmHarvest.sourceChain

  return (
    <Flex mb="24px">
      <WarningIcon color="failure" style={{ alignSelf: 'flex-start' }} />
      <Box ml="4px">
        <Text as="span" bold>
          {`${amount} CAKE`}
        </Text>
        {/* TODO: Harvest confirm with Mochi Error wording */}
        <Text as="span" ml="4px">
          {t(
            'The attempt to claim CAKE rewards did not succeed on the BNB Chain side. Please copy the transaction ID below and look for assistance from our helpful Community Admins or Chefs.',
          )}
        </Text>
      </Box>
    </Flex>
  )
}

const HarvestInfo: React.FC<React.PropsWithChildren<HarvestInfoProps>> = ({ pickedData }) => {
  const { status } = pickedData.farmHarvest.destinationChain

  if (status === HarvestStatusType.PENDING) {
    return <HarvestPending pickedData={pickedData} />
  }

  if (status === HarvestStatusType.FAIL || pickedData?.receipt.status !== 1) {
    return <HarvestError pickedData={pickedData} />
  }

  return <HarvestResult pickedData={pickedData} />
}

export default HarvestInfo
