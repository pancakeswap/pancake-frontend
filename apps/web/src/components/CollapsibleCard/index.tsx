import { useState } from 'react'
import {
  CardProps,
  CardHeader,
  Card,
  Flex,
  Heading,
  IconButton,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@pancakeswap/uikit'

interface CollapsibleCardProps extends CardProps {
  initialOpenState?: boolean
  title: string
}

const CollapsibleCard: React.FC<React.PropsWithChildren<CollapsibleCardProps>> = ({
  initialOpenState = true,
  title,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(initialOpenState)

  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <Card {...props}>
      <CardHeader p="16px">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h3">{title}</Heading>
          <IconButton variant="text" scale="sm" onClick={toggleOpen}>
            {isOpen ? <ChevronUpIcon width="24px" /> : <ChevronDownIcon width="24px" />}
          </IconButton>
        </Flex>
      </CardHeader>
      {isOpen && children}
    </Card>
  )
}

export default CollapsibleCard
