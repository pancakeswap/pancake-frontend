import { useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Modal, InjectedModalProps, Flex, Box, Text, Button, AutoRenewIcon, Image } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import Balance from 'components/Balance'
// import { useCakeBusdPrice } from 'hooks/useBUSDPrice'

interface MultiChainHarvestModalProp extends InjectedModalProps {
  onCancel?: () => void
}

const MultiChainHarvestModal: React.FC<MultiChainHarvestModalProp> = ({ onDismiss, onCancel }) => {
  const { t } = useTranslation()
  const [pendingTx] = useState(false)
  // const cakePriceUsd = useCakeBusdPrice()

  const handleHarvest = () => {
    onDismiss?.()
  }

  const handleCancel = () => {
    onDismiss?.()
  }

  return (
    <Modal
      title={t('Harvest')}
      style={{ maxWidth: '340px' }}
      onDismiss={() => {
        onDismiss?.()
        onCancel()
      }}
    >
      <Flex flexDirection="column">
        <Text bold mb="16px">
          {t('You have earned CAKE rewards on BNB Chain')}
        </Text>
        <LightGreyCard mb="16px" padding="16px">
          <Box mb="8px">
            <Text fontSize="12px" color="secondary" bold as="span">
              {t('CAKE')}
            </Text>
            <Text fontSize="12px" color="textSubtle" ml="4px" bold as="span">
              {t('Earned')}
            </Text>
          </Box>
          <Box mb="16px">
            <Balance bold decimals={3} fontSize="20px" lineHeight="110%" value={31.89} />
            <Balance prefix="~" unit=" USD" decimals={2} value={4.223} fontSize="12px" color="textSubtle" />
          </Box>
          <Button
            width="100%"
            disabled={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleHarvest}
          >
            {pendingTx ? t('Harvesting') : t('Harvest to BNB Smart Chain')}
          </Button>
        </LightGreyCard>
        <Image m="auto auto 10px auto" src="/images/farm/multi-chain-modal.png" width={288} height={220} />
        <Button variant="secondary" onClick={handleCancel}>
          {t('Cancel')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default MultiChainHarvestModal
