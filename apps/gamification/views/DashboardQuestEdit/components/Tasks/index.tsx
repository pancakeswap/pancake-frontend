import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Card, DragIcon, Flex, Text } from '@pancakeswap/uikit'
import { MouseEvent, useRef, useState } from 'react'
import DraggableList from 'react-draggable-list'
import { AddLottery } from 'views/DashboardQuestEdit/components/Tasks/AddLottery'
import { AddLpAddress } from 'views/DashboardQuestEdit/components/Tasks/AddLpAddress'
import { AddSwap } from 'views/DashboardQuestEdit/components/Tasks/AddSwap'
import { AddTaskList } from 'views/DashboardQuestEdit/components/Tasks/AddTaskList'
import { EmptyTasks } from 'views/DashboardQuestEdit/components/Tasks/EmptyTasks'
import { SocialTask } from 'views/DashboardQuestEdit/components/Tasks/SocialTask'
import { TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { TaskType } from 'views/DashboardQuestEdit/type'

const Item = ({ item, dragHandleProps }: { item: TaskConfigType; dragHandleProps: any }) => {
  const { onMouseDown, onTouchStart } = dragHandleProps
  return (
    <Flex mb="4px">
      <DragIcon
        color="#AC9DC4"
        width="20px"
        height="20px"
        className="disable-select dragHandle"
        onTouchStart={(e) => {
          e.preventDefault()
          onTouchStart(e)
        }}
        onMouseDown={(e) => {
          onMouseDown(e)
        }}
      />
      <Card style={{ width: '100%' }}>
        <Box padding="8px">
          {item.type === TaskType.MAKE_A_SWAP && <AddSwap task={item} />}
          {item.type === TaskType.PARTICIPATE_LOTTERY && <AddLottery task={item} />}
          {item.type === TaskType.ADD_LIQUIDITY && <AddLpAddress task={item} />}

          {(item.type === TaskType.X_LINK_POST ||
            item.type === TaskType.X_FOLLOW_ACCOUNT ||
            item.type === TaskType.X_REPOST_POST ||
            item.type === TaskType.TELEGRAM_JOIN_GROUP ||
            item.type === TaskType.DISCORD_JOIN_SERVICE ||
            item.type === TaskType.YOUTUBE_SUBSCRIBE ||
            item.type === TaskType.IG_LIKE_POST ||
            item.type === TaskType.IG_COMMENT_POST ||
            item.type === TaskType.IG_FOLLOW_ACCOUNT) && <SocialTask task={item} />}
        </Box>
      </Card>
    </Flex>
  )
}

export const Tasks = () => {
  const { t } = useTranslation()
  const { tasks, onTasksChange } = useQuestEdit()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <Box position="relative" zIndex={2}>
      <Flex mb="16px" justifyContent="space-between">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        <Box position="relative">
          <Button
            padding="0"
            variant="text"
            height="fit-content"
            style={{ alignSelf: 'center' }}
            endIcon={<AddIcon color="primary" />}
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
          >
            {t('Add a new task')}
          </Button>
          {isOpen && <AddTaskList dropdownRef={dropdownRef} setIsOpen={setIsOpen} />}
        </Box>
      </Flex>
      {tasks.length ? (
        <Flex flexDirection="column">
          <DraggableList
            itemKey="sid"
            list={tasks}
            template={Item as any}
            onMoveEnd={(newTasks: any) => onTasksChange(newTasks as TaskConfigType[])}
          />
        </Flex>
      ) : (
        <EmptyTasks />
      )}
    </Box>
  )
}
