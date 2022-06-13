import { Flex, Box, Button, useModal, Text, Tag, CalculateIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import WinRateModal from 'views/Pottery/components/WinRateModal'

const WinRate: React.FC = () => {
  const { t } = useTranslation()

  const [openWinRateModal] = useModal(<WinRateModal />)

  return (
    <Box>
      <Flex alignItems="center" justifyContent="flex-end" onClick={openWinRateModal}>
        <Tag variant="success">52.12%</Tag> {/* Tag less then 50% show variant failure */}
        <Button variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
          <CalculateIcon color="textSubtle" width="20px" />
        </Button>
      </Flex>
      <Text fontSize="12px" color="textSubtle" mt="4px">
        {t('Chance of winning next round')}
      </Text>
    </Box>
  )
}

export default WinRate
