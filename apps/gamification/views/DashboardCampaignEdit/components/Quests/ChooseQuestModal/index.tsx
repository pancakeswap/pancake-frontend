import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Checkbox, Flex, FlexGap, InjectedModalProps, Modal, ModalBody, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'
import { CheckedIcon } from 'views/DashboardCampaignEdit/components/Quests/ChooseQuestModal/CheckedIcon'
import { Quest } from 'views/Quests/components/Quest'

const Container = styled(Box)`
  position: relative;
  margin-top: 14px;
  padding: 24px 16px;
  border-radius: 24px;
  border: 2px dashed ${({ theme }) => (theme.isDark ? `${theme.colors.input}` : `${theme.colors.inputSecondary}`)};
`

const CheckboxArea = styled('label')`
  display: flex;
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translate(-50%);
  background: ${({ theme }) => theme.card.background};
  padding-right: 8px;
`

const StyledFlexGap = styled(FlexGap)`
  max-height: 500px;
  overflow-y: auto;

  > div {
    width: calc(50% - 8px);
  }
`

const StyledCheckedIcon = styled(CheckedIcon)`
  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: 48px;
  z-index: 1;
  fill: ${({ theme }) => theme.colors.cardBorder};
`

const OutlineContainer = styled(Box)<{ checked?: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  cursor: pointer;

  ${({ checked, theme }) =>
    checked &&
    `
  > div > div {
    background:  ${theme.colors.primary};
    }

    ${StyledCheckedIcon} {
      fill:  ${theme.colors.primary};
    }
  `}
`

const Footer = styled.div`
  width: 100%;
  padding-top: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

interface ChooseQuestProps extends InjectedModalProps {}

export const ChooseQuestModal: React.FC<ChooseQuestProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const [selectAll, setSelectAll] = useState(false)

  const handleSubmit = () => {}

  return (
    <Modal title={t('Choose the quests to assign')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '672px']}
      >
        <ModalBody>
          <Container>
            <CheckboxArea htmlFor="select-all">
              <Checkbox
                id="select-all"
                scale="sm"
                type="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
              />
              <Text ml="8px">{t('Select all %total%', { total: 6 })}</Text>
            </CheckboxArea>
            <StyledFlexGap flexWrap="wrap" gap="16px">
              <OutlineContainer>
                <StyledCheckedIcon width={48} height={48} />
                <Quest isDraft hideClick />
              </OutlineContainer>
              <OutlineContainer>
                <StyledCheckedIcon width={48} height={48} />
                <Quest isDraft hideClick />
              </OutlineContainer>
            </StyledFlexGap>
          </Container>
          <Footer>
            <Button display="block" margin="auto">
              {t('Assign')}
            </Button>
          </Footer>
        </ModalBody>
      </Flex>
    </Modal>
  )
}
