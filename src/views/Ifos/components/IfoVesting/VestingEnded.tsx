import { useTranslation } from 'contexts/Localization'
import { Text } from '@pancakeswap/uikit'

const VestingEnded: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Text color="textSubtle" fontSize="14px" pb="24px">
      {t('You have claimed all available token.')}
    </Text>
  )
}

export default VestingEnded
