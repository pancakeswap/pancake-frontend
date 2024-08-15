import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, DeleteOutlineIcon, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import { useEffect, useRef, useState } from 'react'
import { HOLD_DURATION } from 'views/DashboardQuestEdit/config/index'
import { LongPressSvg } from './LongPressSvg'

interface LongPressDeleteModalProps extends InjectedModalProps {
  targetTitle: string
  handleDelete: () => void
}

export const LongPressDeleteModal: React.FC<LongPressDeleteModalProps> = ({ targetTitle, handleDelete, onDismiss }) => {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const startLongPress = () => {
    timerRef.current = window.setTimeout(() => {
      setProgress(100)
      handleClickDelete()
    }, HOLD_DURATION)

    let start: number | null = null
    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const percentage = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setProgress(percentage)

      if (elapsed < HOLD_DURATION) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const endLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setProgress(0)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleClickDelete = () => {
    handleDelete()
    onDismiss?.()
  }

  return (
    <Modal title={t('Delete the %name%', { name: targetTitle })} headerBorderColor="transparent" onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '380px']}
      >
        <Box width="100%" mt="-30px">
          <DeleteOutlineIcon display="block" m="auto" width={50} height={50} color="failure" />
          <Box mt="20px">
            <Text color="textSubtle" as="span">
              {t('Are you sure you want to delete the %name%? This will result in the', { name: targetTitle })}
            </Text>
            <Text color="failure" bold as="span" m="0 4px">
              {t('loss of all your progress and funds')}
            </Text>
            <Text color="textSubtle" as="span">
              {t('and cannot be undone.')}
            </Text>
          </Box>
          <Button
            mt="40px"
            width="100%"
            variant="danger"
            onMouseDown={startLongPress}
            onTouchStart={startLongPress}
            onMouseUp={endLongPress}
            onMouseLeave={endLongPress}
            onTouchEnd={endLongPress}
            endIcon={<LongPressSvg progress={progress} />}
          >
            {t('Hold to delete')}
          </Button>
        </Box>
      </Flex>
    </Modal>
  )
}
