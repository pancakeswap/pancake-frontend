import { styled } from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const Dot = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  background: ${({ theme }) => theme.colors.warning};
`

const NavButton = styled(Text)`
  position: relative;
  cursor: pointer;
  margin-left: 16px;
  padding: 0 4px 10px 4px;
  color: ${({ theme }) => theme.colors.textSubtle};

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: initial;
  }
`

const Container = styled(Flex)<{ activeIndex: number }>`
  width: 100%;
  margin-bottom: 30px;
  border-bottom: ${({ theme }) => `solid 1px ${theme.colors.cardBorder}`};

  & ${NavButton}:first-child {
    margin-left: 0;
  }

  & ${NavButton}:nth-child(${({ activeIndex }) => activeIndex}) {
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: 600;
    &:before {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`

export enum MenuType {
  Latest = 'latest',
  HISTORICAL = 'Historical',
}

interface TabMenuProps {
  menuType: MenuType
  inCompletedNumber: number
  onTypeChange: (menuType: MenuType) => void
}

const getIndexFromType = (menuType: MenuType) => {
  switch (menuType) {
    case MenuType.HISTORICAL:
      return 2
    default:
      return 1
  }
}

const TabMenu: React.FC<React.PropsWithChildren<TabMenuProps>> = ({ menuType, inCompletedNumber, onTypeChange }) => {
  const { t } = useTranslation()

  return (
    <Container activeIndex={getIndexFromType(menuType)}>
      <NavButton onClick={() => onTypeChange(MenuType.Latest)}>{t('Latest rewards')}</NavButton>
      <NavButton onClick={() => onTypeChange(MenuType.HISTORICAL)}>
        <Flex alignItems="center">
          {t('Historical Claim')}
          {inCompletedNumber > 0 && <Dot />}
        </Flex>
      </NavButton>
    </Container>
  )
}

export default TabMenu
