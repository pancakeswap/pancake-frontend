import { useTranslation } from '@pancakeswap/localization'
import { QuestionHelper, Tag, TagProps, Flex } from '@pancakeswap/uikit'
import { ReactNode } from 'react'

export function RangeTag({
  removed,
  outOfRange,
  children,
  ...props
}: { removed?: boolean; outOfRange: boolean; children?: ReactNode } & TagProps) {
  const { t } = useTranslation()

  return removed ? (
    <Tag variant="textSubtle" {...props}>
      {children || t('Closed')}
    </Tag>
  ) : outOfRange ? (
    <Tag variant="failure" {...props}>
      {children || (
        <Flex alignItems="center">
          {t('Inactive')}{' '}
          <QuestionHelper
            position="relative"
            top="1px"
            ml="4px"
            text={t(
              'The position is inactive and not earning trading fees due to the current price being out of the set price range.',
            )}
            size="20px"
            color="white"
            placement="bottom"
          />
        </Flex>
      )}
    </Tag>
  ) : (
    <Tag variant="success" {...props}>
      {children || t('Active')}
    </Tag>
  )
}
