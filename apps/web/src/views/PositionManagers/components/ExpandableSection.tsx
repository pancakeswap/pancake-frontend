import { SpaceProps } from 'styled-system'
import { PropsWithChildren, memo, useCallback, useState } from 'react'
import { Flex, ExpandableLabel, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export const ExpandableSection = memo(function ExpandableSection({
  children,
  ...props
}: PropsWithChildren<SpaceProps>) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const toggle = useCallback(() => setExpanded(!expanded), [expanded])

  return (
    <Flex flexDirection="column" {...props}>
      <ExpandableLabel expanded={expanded} onClick={toggle}>
        <Text color="primary" bold>
          {expanded ? t('Hide') : t('Info')}
        </Text>
      </ExpandableLabel>
      {expanded ? children : null}
    </Flex>
  )
})
