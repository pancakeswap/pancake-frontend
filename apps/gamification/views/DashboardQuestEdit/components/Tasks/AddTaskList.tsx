import { Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Dropdown } from 'views/DashboardCampaigns/components/Dropdown'
import { TaskType, useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'

const StyledDropdown = styled(Dropdown)`
  width: 280px;
  top: 30px;
  right: 0px;
  z-index: 10;
`

interface AddTaskListProps {
  setIsOpen: (isOpen: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement>
}

export const AddTaskList: React.FC<AddTaskListProps> = ({ setIsOpen, dropdownRef }) => {
  const { taskIcon, taskNaming } = useTaskInfo(true)

  const closeDropdown = () => {
    setIsOpen(false)
  }

  return (
    <StyledDropdown setIsOpen={setIsOpen} dropdownRef={dropdownRef}>
      {Object.keys(TaskType).map((i) => (
        <Flex key={i} onClick={closeDropdown}>
          <Flex mr="8px" alignSelf="center">
            {taskIcon(i as TaskType)}
          </Flex>
          <Text style={{ alignSelf: 'center' }}>{taskNaming(i as TaskType)}</Text>
        </Flex>
      ))}
    </StyledDropdown>
  )
}
