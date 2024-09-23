import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Card, DragIcon, Flex, Text } from '@pancakeswap/uikit'
import { MouseEvent, useMemo, useRef, useState } from 'react'
import DraggableList from 'react-draggable-list'
import { AddBlogPost } from 'views/DashboardQuestEdit/components/Tasks/AddBlogPost'
import { AddHoldToken } from 'views/DashboardQuestEdit/components/Tasks/AddHoldToken'
import { AddLottery } from 'views/DashboardQuestEdit/components/Tasks/AddLottery'
import { AddLpAddress } from 'views/DashboardQuestEdit/components/Tasks/AddLpAddress'
import { AddMakePrediction } from 'views/DashboardQuestEdit/components/Tasks/AddMakePrediction'
import { AddSwap } from 'views/DashboardQuestEdit/components/Tasks/AddSwap'
import { AddTaskList } from 'views/DashboardQuestEdit/components/Tasks/AddTaskList'
import { EmptyTasks } from 'views/DashboardQuestEdit/components/Tasks/EmptyTasks'
import { SocialTask } from 'views/DashboardQuestEdit/components/Tasks/SocialTask'
import { StateType, TaskConfigType } from 'views/DashboardQuestEdit/context/types'
import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
import { CompletionStatus, TaskType } from 'views/DashboardQuestEdit/type'

const Item = ({
  item,
  commonProps,
  dragHandleProps,
}: {
  item: TaskConfigType
  commonProps: { isDrafted: boolean }
  dragHandleProps: any
}) => {
  const { onMouseDown, onTouchStart } = dragHandleProps
  const { isDrafted } = commonProps

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
          {item.taskType === TaskType.MAKE_A_SWAP && <AddSwap task={item} isDrafted={isDrafted} />}
          {item.taskType === TaskType.MAKE_A_PREDICTION && <AddMakePrediction task={item} isDrafted={isDrafted} />}
          {item.taskType === TaskType.HOLD_A_TOKEN && <AddHoldToken task={item} isDrafted={isDrafted} />}
          {item.taskType === TaskType.PARTICIPATE_LOTTERY && <AddLottery task={item} isDrafted={isDrafted} />}
          {item.taskType === TaskType.ADD_LIQUIDITY && <AddLpAddress task={item} isDrafted={isDrafted} />}
          {item.taskType === TaskType.VISIT_BLOG_POST && <AddBlogPost task={item} isDrafted={isDrafted} />}

          {(item.taskType === TaskType.X_LIKE_POST ||
            item.taskType === TaskType.X_FOLLOW_ACCOUNT ||
            item.taskType === TaskType.X_REPOST_POST ||
            item.taskType === TaskType.TELEGRAM_JOIN_GROUP ||
            item.taskType === TaskType.DISCORD_JOIN_SERVER ||
            item.taskType === TaskType.YOUTUBE_SUBSCRIBE ||
            item.taskType === TaskType.IG_LIKE_POST ||
            item.taskType === TaskType.IG_COMMENT_POST ||
            item.taskType === TaskType.IG_FOLLOW_ACCOUNT) && <SocialTask task={item} isDrafted={isDrafted} />}
        </Box>
      </Card>
    </Flex>
  )
}

interface TasksProps {
  state: StateType
}

export const Tasks: React.FC<TasksProps> = ({ state }) => {
  const { t } = useTranslation()
  const { tasks, onTasksChange } = useQuestEdit()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isDrafted = useMemo(() => state?.completionStatus === CompletionStatus.DRAFTED, [state])

  return (
    <Box position="relative" zIndex={2}>
      <Flex mb="16px" justifyContent="space-between">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        {isDrafted && (
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
              {t('Add')}
            </Button>
            {isOpen && <AddTaskList dropdownRef={dropdownRef} setIsOpen={setIsOpen} />}
          </Box>
        )}
      </Flex>
      {tasks?.length ? (
        <Flex flexDirection="column">
          <DraggableList
            itemKey="sid"
            list={tasks}
            commonProps={{ isDrafted }}
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
