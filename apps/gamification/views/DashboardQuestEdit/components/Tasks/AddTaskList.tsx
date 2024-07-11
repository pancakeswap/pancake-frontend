import { Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Dropdown } from 'views/DashboardCampaigns/components/Dropdown'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { useTaskInfo } from 'views/DashboardQuestEdit/hooks/useTaskInfo'
import { SUPPORT_ADD_TASK, TaskType } from 'views/DashboardQuestEdit/type'
import { generateNewTask } from 'views/DashboardQuestEdit/utils/generateNewTask'

const StyledDropdown = styled(Dropdown)`
  width: 280px;
  top: 30px;
  right: 0px;
  z-index: 100;
`

interface AddTaskListProps {
  setIsOpen: (isOpen: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement>
}

export const AddTaskList: React.FC<AddTaskListProps> = ({ setIsOpen, dropdownRef }) => {
  const { taskIcon, taskNaming } = useTaskInfo(true)
  const { tasks, onTasksChange } = useQuestEdit()

  const closeDropdown = (taskType: TaskType) => {
    const newTask = generateNewTask(tasks, taskType)
    if (newTask) {
      const newTasks = tasks ? [newTask, ...tasks] : [newTask]
      onTasksChange(newTasks)
    }

    setIsOpen(false)
  }

  return (
    <StyledDropdown setIsOpen={setIsOpen} dropdownRef={dropdownRef}>
      {SUPPORT_ADD_TASK.map((i) => (
        <Flex key={i} onClick={() => closeDropdown(i as TaskType)}>
          <Flex mr="8px" alignSelf="center">
            {taskIcon(i as TaskType)}
          </Flex>
          <Text style={{ alignSelf: 'center' }}>{taskNaming(i as TaskType)}</Text>
        </Flex>
      ))}
    </StyledDropdown>
  )
}
