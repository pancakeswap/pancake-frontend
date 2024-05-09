import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, Card, DragIcon, Flex, Text } from '@pancakeswap/uikit'
import { MouseEvent, useRef, useState } from 'react'
import DraggableList from 'react-draggable-list'
// import { AddLottery } from 'views/DashboardQuestEdit/components/Tasks/AddLottery'
import { AddSwap } from 'views/DashboardQuestEdit/components/Tasks/AddSwap'
// import { AddLpAddress } from 'views/DashboardQuestEdit/components/Tasks/AddLpAddress'
import { AddTaskList } from 'views/DashboardQuestEdit/components/Tasks/AddTaskList'
// import { SocialTask } from 'views/DashboardQuestEdit/components/Tasks/SocialTask'

const data = Array(10)
  .fill(null)
  .map((item, index) => ({ id: index }))

// const Item = ({ item, itemSelected, dragHandleProps }: any) => {
const Item = ({ dragHandleProps }: any) => {
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
          <AddSwap />
          {/* <AddLottery /> */}
          {/* <AddLpAddress /> */}
          {/* <SocialTask /> */}
        </Box>
      </Card>
    </Flex>
  )
}

export const Tasks = () => {
  const { t } = useTranslation()
  const [list, setList] = useState(data)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const _onListChange = (newList: any) => {
    setList(newList)
  }

  return (
    <Box position="relative" zIndex="0">
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
      <Flex flexDirection="column" ref={containerRef}>
        <DraggableList
          itemKey="id"
          list={list}
          template={Item as any}
          onMoveEnd={(newList: any) => _onListChange(newList)}
          container={() => containerRef?.current}
        />
      </Flex>
    </Box>
  )
}
