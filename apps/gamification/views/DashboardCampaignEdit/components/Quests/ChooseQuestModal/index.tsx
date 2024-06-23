import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, InjectedModalProps, Modal, ModalBody, Text } from '@pancakeswap/uikit'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { CheckedIcon } from 'views/DashboardCampaignEdit/components/Quests/ChooseQuestModal/CheckedIcon'
// import { Quest } from 'views/Quests/components/Quest'

const Container = styled(Box)`
  position: relative;
  margin-top: 14px;
  padding: 24px 16px;
  border-radius: 24px;
  border: 2px dashed ${({ theme }) => (theme.isDark ? `${theme.colors.input}` : `${theme.colors.inputSecondary}`)};
`

const CheckboxArea = styled('div')`
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

const StyledCustomCheckBox = styled(Box)<{ $checked?: boolean; $checkedAll?: boolean }>`
  position: relative;
  height: 24px;
  width: 24px;
  min-height: 24px;
  min-width: 24px;
  transition: background-color 0.2s ease-in-out;
  border-radius: 8px;
  border: ${({ theme }) => (theme.isDark ? `solid 1px ${theme.colors.disabled}` : '0')};
  background-color: ${({ theme, $checked, $checkedAll }) =>
    $checked || $checkedAll ? theme.colors.success : theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.inset};
  margin: 3px 3px 3px 4px;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    width: 50%;
    height: 2px;
    margin: auto;
    background-color: ${({ $checked }) => ($checked ? 'white' : 'transparent')};
  }

  &:before {
    content: '';
    position: absolute;
    border-bottom: 2px solid;
    border-left: 2px solid;
    top: 30%;
    left: 0;
    right: 0;
    width: 50%;
    height: 25%;
    margin: auto;
    transform: rotate(-50deg);
    transition: border-color 0.2s ease-in-out;
    border-color: ${({ $checkedAll }) => ($checkedAll ? 'white' : 'transparent')};
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

const OutlineContainer = styled(Box)<{ $checked?: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 24px;

  > div > div {
    cursor: pointer !important;
  }

  ${({ $checked, theme }) =>
    $checked &&
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

interface ChooseQuestProps extends InjectedModalProps {
  pickedQuests: Array<string>
  updatePickedQuests: (key: string, value: any) => void
}

export const ChooseQuestModal: React.FC<ChooseQuestProps> = ({ pickedQuests, updatePickedQuests, onDismiss }) => {
  const { t } = useTranslation()
  const [selectedQuests, setSelectedQuests] = useState<Array<string>>([])
  const fakeData = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }]

  useEffect(() => {
    if (pickedQuests.length > 0) {
      setSelectedQuests(pickedQuests)
    }
  }, [pickedQuests])

  const handleSelectQuest = (id: string) => {
    const findIndex = selectedQuests.findIndex((i: any) => i === id)
    if (findIndex >= 0) {
      selectedQuests.splice(findIndex, 1)
      setSelectedQuests([...selectedQuests])
    } else {
      selectedQuests.push(id)
      setSelectedQuests([...selectedQuests])
    }
  }

  const handleSubmit = () => {
    updatePickedQuests('pickedQuests', selectedQuests)
    onDismiss?.()
  }

  const handleCheckboxClick = () => {
    if (selectedQuests.length === 0) {
      const allId = fakeData.map((i) => i.id)
      setSelectedQuests(allId)
    } else {
      setSelectedQuests([])
    }
  }

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
            <CheckboxArea>
              <StyledCustomCheckBox
                $checked={selectedQuests.length > 0 && selectedQuests.length < fakeData.length}
                $checkedAll={selectedQuests.length === fakeData.length}
                onClick={handleCheckboxClick}
              />
              <Flex>
                <Text m="0 8px">{t('Selected')}</Text>
                <Box>
                  <Text as="span">{selectedQuests.length}</Text>
                  <Text as="span" color="textSubtle">{`/${fakeData.length}`}</Text>
                </Box>
              </Flex>
            </CheckboxArea>
            <StyledFlexGap flexWrap="wrap" gap="16px">
              {fakeData.map((quest) => (
                <OutlineContainer
                  key={quest.id}
                  $checked={selectedQuests.includes(quest.id)}
                  onClick={() => handleSelectQuest(quest.id)}
                >
                  <StyledCheckedIcon width={48} height={48} />
                  {/* <Quest quest={quest} hideClick /> */}
                </OutlineContainer>
              ))}
            </StyledFlexGap>
          </Container>
          <Footer>
            <Button display="block" margin="auto" onClick={handleSubmit}>
              {t('Assign')}
            </Button>
          </Footer>
        </ModalBody>
      </Flex>
    </Modal>
  )
}
