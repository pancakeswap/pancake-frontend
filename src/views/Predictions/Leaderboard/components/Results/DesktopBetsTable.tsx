import React from 'react'
import { Box, Card, Text } from '@tovaswapui/uikit'
import { useTranslation } from 'contexts/Localization'
import PreviousBetsTable from '../PreviousBetsTable'

interface DesktopBetsTableProps {
  account: string
}

const DesktopBetsTable: React.FC<DesktopBetsTableProps> = ({ account }) => {
  const { t } = useTranslation()

  return (
    <Box p="24px">
      <Text as="h5" color="secondary" fontWeight="bold" textTransform="uppercase" fontSize="12px" mb="16px">
        {t('Last %num% Bets', { num: 5 })}
      </Text>
      <Card>
        <PreviousBetsTable account={account} />
      </Card>
    </Box>
  )
}

export default DesktopBetsTable
