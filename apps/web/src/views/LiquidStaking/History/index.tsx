import { CardBody, Text, Box, RowBetween } from '@pancakeswap/uikit'
// import { AppHeader } from 'components/App'
// import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'

export function LiquidStakingPageHistory() {
  // const { t } = useTranslation()

  return (
    <>
      {/* <AppHeader subtitle='Track your reward' title='Reward History' noConfig /> */}
      <CardBody>
        {/* <Text fontSize="12px" mb="8px" color="secondary" bold textTransform="uppercase">
          Enter your wallet address
        </Text> */}
        <Box mb="8px">
          {/* <Input
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder='Wallet Address'
            pattern="^(0x[a-fA-F0-9]{40})$"
            onChange={() => {}}
            value=""
          /> */}
        </Box>
        {/* <Text fontSize="12px" mb="8px" color="secondary" bold textTransform="uppercase">
          your rewards
        </Text> */}
        <LightGreyCard>
          <RowBetween>
            <Text>BETH Balance</Text>
            <Text>0.12321</Text>
          </RowBetween>
        </LightGreyCard>
      </CardBody>
    </>
  )
}
