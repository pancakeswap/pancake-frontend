import React from 'react'
import styled from 'styled-components'
import { ChevronDownIcon, ChevronUpIcon} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import variables from 'style/variables'

export interface ExpandableSectionButtonProps {
  onClick?: () => void
  expanded?: boolean
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color:${variables.secondary};

  svg {
    fill: ${variables.secondary};
  }
`
const Text = styled.p`
color: ${variables.secondary};
`;

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({ onClick, expanded }) => {
  const { t } = useTranslation()

  return (
    <Wrapper aria-label={t('Hide or show expandable content')} role="button" onClick={() => onClick()}>
      <Text>
        {expanded ? t('Hide') : t('Details')}
      </Text>
      {expanded ? <ChevronUpIcon  /> : <ChevronDownIcon />}
    </Wrapper>
  )
}

ExpandableSectionButton.defaultProps = {
  expanded: false,
}

export default ExpandableSectionButton
