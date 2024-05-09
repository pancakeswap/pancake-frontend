import { Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Dropdown } from 'views/DashboardCampaigns/components/Dropdown'

const StyledDropdown = styled(Dropdown)`
  width: 200px;
  top: 30px;
  right: 0px;
`

interface AddTaskListProps {
  setIsOpen: (isOpen: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement>
}

export const AddTaskList: React.FC<AddTaskListProps> = ({ setIsOpen, dropdownRef }) => {
  const closeDropdown = () => {
    setIsOpen(false)
  }

  return (
    <StyledDropdown setIsOpen={setIsOpen} dropdownRef={dropdownRef}>
      <Flex onClick={closeDropdown}>
        <Text ml="8px">Statistics</Text>
      </Flex>
      <Flex onClick={closeDropdown}>
        <Text ml="14px">Edit</Text>
      </Flex>
    </StyledDropdown>
  )
}
