import React from 'react'
import { Flex, Box, Text, BunnyPlaceholderIcon, Button } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import Divider from 'components/Divider'
import ProgressStepper from './ProgressStepper'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import IfoVestingFooter from './IfoVestingFooter'

const IfoVestingCard: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column">
      <Box>
        <ProgressStepper
          steps={[{ text: 'Sales ended' }, { text: 'Cliff' }, { text: 'Vesting end' }]}
          activeStepIndex={1}
        />
        <LightGreyCard mt="35px" mb="24px">
          <Flex>
            <BunnyPlaceholderIcon mr="16px" width={32} height={32} style={{ alignSelf: 'flex-start' }} />
            <Box>
              <Text color="secondary" bold fontSize="12px">
                Total XYZ purchased
              </Text>
              <Text bold fontSize="20px">
                ~234.5612
              </Text>
            </Box>
          </Flex>
        </LightGreyCard>
        <ReleasedTokenInfo />
        <Divider />
        <LightGreyCard mt="24px" mb="8px">
          <Flex>
            <BunnyPlaceholderIcon mr="16px" width={32} height={32} style={{ alignSelf: 'flex-start' }} />
            <Box>
              <Text bold color="secondary" fontSize="12px">
                xyz available to claim
              </Text>
              <Text as="span" bold fontSize="20px">
                52.1234
              </Text>
              <Text as="span" bold color="textSubtle" fontSize="20px">
                /234.5612
              </Text>
            </Box>
          </Flex>
        </LightGreyCard>
        <Text mb="24px" color="textSubtle" fontSize="14px">
          You’ve already claimed 48.5733 XYZ
        </Text>
        <Button mb="24px" width="100%">
          Claim
        </Button>
      </Box>
      <IfoVestingFooter />
    </Flex>
  )
}

export default IfoVestingCard
