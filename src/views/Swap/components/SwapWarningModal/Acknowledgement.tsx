import { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex, Checkbox, Button } from '@pancakeswap/uikit'

interface AcknowledgementProps {
  handleContinueClick: () => void
}

const Acknowledgement: React.FC<AcknowledgementProps> = ({ handleContinueClick }) => {
  const { t } = useTranslation()
  const [isConfirmed, setIsConfirmed] = useState(false)

  return (
    <>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Checkbox
            name="confirmed"
            type="checkbox"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            scale="sm"
          />
          <Text ml="10px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex>

        <Button disabled={!isConfirmed} onClick={handleContinueClick}>
          {t('Continue')}
        </Button>
      </Flex>
    </>
  )
}

export default Acknowledgement
