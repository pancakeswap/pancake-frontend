import { memo } from 'react'
import { PageHeader, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export const Header = memo(function Header() {
  const { t } = useTranslation()

  return (
    <PageHeader>
      <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
        <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
          <Heading as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Position Managers')}
          </Heading>
          <Heading scale="md" color="text">
            {t('Just stake some tokens to earn.')}
          </Heading>
          <Heading scale="md" color="text">
            {t('High APR, low risk.')}
          </Heading>
        </Flex>
      </Flex>
    </PageHeader>
  )
})
