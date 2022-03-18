import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { ORDER_CATEGORY } from '../../types'

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
`

interface OrderTabProps {
  activeIndex: ORDER_CATEGORY
  onItemClick: (index: ORDER_CATEGORY) => void
}

const OrderTab: React.FC<OrderTabProps> = ({ activeIndex, onItemClick }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} onItemClick={onItemClick}>
        {[t('Open Orders'), t('Order History')].map((content, idx) => (
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

export default OrderTab
