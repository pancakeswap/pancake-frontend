import { BunnyPlaceholderIcon, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface ComingSoonProps {
  children?: React.ReactNode
}

const ComingSoon: React.FC<React.PropsWithChildren<ComingSoonProps>> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px">
      <BunnyPlaceholderIcon width="72px" height="72px" />
      <Heading as="h5" scale="md" color="textDisabled">
        {children || t('Coming Soon!')}
      </Heading>
    </Flex>
  )
}

export default ComingSoon
