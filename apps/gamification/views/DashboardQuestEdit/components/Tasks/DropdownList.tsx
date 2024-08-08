import { useTranslation } from '@pancakeswap/localization'
import { Box, BoxProps, DeleteOutlineIcon, EllipsisIcon, Flex, Text } from '@pancakeswap/uikit'
import { useRef } from 'react'
import { styled } from 'styled-components'
import { OptionIcon } from 'views/DashboardQuestEdit/components/Tasks/OptionIcon'
import { PopperWrapper } from 'views/DashboardQuestEdit/components/Tasks/Propper'

const DropdownContainer = styled(Flex)`
  position: absolute;
  z-index: 2;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};

  > div,
  > a {
    width: 100%;
    padding: 8px 16px;

    &:hover {
      text-decoration: none;
      background-color: ${({ theme }) => theme.colors.dropdown};
    }

    &:first-child {
      padding-top: 16px;
    }
    &:last-child {
      padding-bottom: 16px;
    }
  }
`

const StyledDropdown = styled(DropdownContainer)`
  width: 180px;
  left: -160px;
  bottom: 20px;
`

interface DropdownListProps extends BoxProps {
  id: string
  isOptional: boolean
  onClickDelete: () => void
  onClickOptional: () => void
}

export const DropdownList: React.FC<DropdownListProps> = (props) => {
  const popperRef = useRef(null)
  const { t } = useTranslation()
  const { id, isOptional, onClickDelete, onClickOptional } = props

  return (
    <Box {...props} width={20} id={id} height={20} style={{ cursor: 'pointer' }}>
      <EllipsisIcon style={{ pointerEvents: 'none' }} color="primary" width="12px" height="12px" />
      <PopperWrapper target={id} ref={popperRef} placement="top" toggle="legacy">
        <StyledDropdown>
          <Flex onClick={onClickDelete}>
            <DeleteOutlineIcon width="28px" height="20px" color="primary" />
            <Text ml="8px">{t('Remove')}</Text>
          </Flex>
          <Flex onClick={onClickOptional}>
            <OptionIcon width="28px" height="20px" color="primary" />
            <Text ml="6px">{isOptional ? t('Unmake') : t('Make optional')}</Text>
          </Flex>
        </StyledDropdown>
      </PopperWrapper>
    </Box>
  )
}
