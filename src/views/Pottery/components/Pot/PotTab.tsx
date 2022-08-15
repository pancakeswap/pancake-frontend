import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from '@pancakeswap/localization'
import { POT_CATEGORY } from '../../types'

const Wrapper = styled.div`
  & > div {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.input};
    border: 0;
  }
  & button {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.input};
    border-radius: 20px 20px 0 0;
  }
`

interface PotTabProps {
  activeIndex: POT_CATEGORY
  onItemClick: (index: POT_CATEGORY) => void
}

const PotTab: React.FC<React.PropsWithChildren<PotTabProps>> = ({ activeIndex, onItemClick }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} onItemClick={onItemClick}>
        {[t('Deposit'), t('Claim')].map((content, idx) => (
          <ButtonMenuItem
            key={content}
            style={{
              color: idx === activeIndex ? theme.colors.text : theme.colors.textSubtle,
              backgroundColor: idx === activeIndex ? theme.card.background : theme.colors.input,
            }}
          >
            {content}
          </ButtonMenuItem>
        ))}
      </ButtonMenu>
    </Wrapper>
  )
}

export default PotTab
