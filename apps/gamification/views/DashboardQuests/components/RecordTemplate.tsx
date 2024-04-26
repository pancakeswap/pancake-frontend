import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import { styled } from 'styled-components'

const Container = styled(Box)`
  padding: 24px;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(0deg, #3D2A54 0%, #313D5C 100%)'
      : 'linear-gradient(0deg, #f1eeff 0%, #e9f6ff 100%)'};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 40px 24px;
  }
`

const IconButton = styled(Button)`
  display: block;
  align-self: center;
  margin-left: auto;

  > svg {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`

const StyledButtonMenu = styled(ButtonMenu)`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > button {
    width: calc(50% - 4px);
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: fit-content;

    > button {
      width: fit-content;
    }
  }
`

interface RecordTemplateProps {
  title: string
  createButtonText: string
  children?: React.ReactNode
}

export const RecordTemplate: React.FC<RecordTemplateProps> = ({ title, createButtonText, children }) => {
  const { t } = useTranslation()

  const [statusButtonIndex, setStatusButtonIndex] = useState(0)

  const onStatusButtonChange = (newIndex: number) => {
    setStatusButtonIndex(newIndex)
  }

  return (
    <Flex flexDirection="column">
      <Container>
        <Flex maxWidth={['1200px']} margin="auto" flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex>
            <Text fontSize={['36px']} bold>
              {title}
            </Text>
            <IconButton scale="sm" endIcon={<AddIcon color="invertedContrast" />} />
          </Flex>
          <Flex width="100%" alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}>
            <StyledButtonMenu
              scale="sm"
              variant="subtle"
              m={['0', '0', '0 auto 0 0', '0 auto 0 0', 'auto']}
              activeIndex={statusButtonIndex}
              onItemClick={onStatusButtonChange}
            >
              <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Scheduled')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Drafted')}</ButtonMenuItem>
            </StyledButtonMenu>
            <Button display={['none', 'none', 'flex']} scale="sm" endIcon={<AddIcon color="invertedContrast" />}>
              {createButtonText}
            </Button>
          </Flex>
        </Flex>
      </Container>
      {children}
    </Flex>
  )
}
