import {
  Button,
  Heading,
  Text,
  ButtonProps,
  HelpIcon,
  Flex,
  TooltipText,
  useTooltip,
  LinkExternal,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import _isEmpty from 'lodash/isEmpty'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'

const Container = styled.div`
  margin-right: 4px;
`

interface ActionButtonPropsType extends ButtonProps {
  title: string
  description: string
  button?: ReactNode
}

const BoosterTooltip = () => {
  const { t } = useTranslation()

  return (
    <>
      {t(
        `Boost multiplier is calculated based on the staking conditions from both Farms and fixed-term CAKE syrup pool and will be automatically updated upon user actions.`,
      )}
      <LinkExternal
        href="https://docs.pancakeswap.finance/products/yield-farming/bcake/faq#how-are-the-bcake-multipliers-calculated"
        external
      >
        {t('Learn More')}
      </LinkExternal>
    </>
  )
}

const ActionButton: React.FC<ActionButtonPropsType> = ({ title, description, button, ...props }) => {
  const { isMobile } = useMatchBreakpoints()
  let btn = null

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<BoosterTooltip />, {
    placement: 'top',
    ...(isMobile && { hideTimeout: 1500 }),
  })

  if (button) {
    btn = button
  } else if (!_isEmpty(props)) {
    btn = <Button {...props} />
  }

  return (
    <>
      <Container>
        <Flex>
          <Heading mr="4px">{title}</Heading>
          <TooltipText ref={targetRef}>
            <HelpIcon width="20px" height="20px" />
          </TooltipText>
          {tooltipVisible && tooltip}
        </Flex>

        <Text color="textSubtle" fontSize="12px">
          {description}
        </Text>
      </Container>
      {btn}
    </>
  )
}

export default ActionButton
