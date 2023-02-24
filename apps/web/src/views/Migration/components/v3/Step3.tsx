import { AutoRow, Box, Text } from '@pancakeswap/uikit'
import { LightCard } from 'components/Card'

export function Step3() {
  // const { t } = useTranslation()

  return (
    <Box>
      <Text>V3 Quick Start</Text>
      <AutoRow
        gap="32px"
        flexWrap={{
          xs: 'wrap',
          md: 'nowrap',
        }}
      >
        <LightCard minWidth={['100%', null, null, '50%']}>
          <Text>Introducing Fee tiers</Text>
        </LightCard>
        <LightCard minWidth={['100%', null, null, '50%']}>
          <Text>Introducing Price Range</Text>
        </LightCard>
      </AutoRow>
    </Box>
  )
}
