import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, Flex, PencilIcon, VolumeIcon } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ActionModal } from 'views/DashboardCampaignEdit/components/SubmitAction/ActionModal'
// import { useQuestEdit } from 'views/DashboardQuestEdit/context/useQuestEdit'
// import { combineDateAndTime, convertDateAndTime } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { query } = useRouter()
  // const { state } = useQuestEdit()
  const disabled = false
  const [openModal, setOpenModal] = useState(false)
  const [isPublish, setIsPublish] = useState(false)

  const handleClick = (publish: boolean) => {
    // const { startDate, startTime, endDate, endTime } = state
    // const startDateTime = combineDateAndTime(startDate, startTime) || 0
    // const endDateTime = combineDateAndTime(endDate, endTime) || 0

    setOpenModal(true)
    setIsPublish(publish)
  }

  return (
    <Flex flexDirection="column" mt="30px">
      {openModal && <ActionModal openModal={openModal} isPublish={isPublish} setOpenModal={setOpenModal} />}
      {query.id ? (
        <>
          <Button
            width="100%"
            variant="secondary"
            endIcon={<CalenderIcon color="primary" width={20} height={20} />}
            onClick={() => handleClick(false)}
          >
            {t('Save and schedule')}
          </Button>
          <Button
            width="100%"
            mt="8px"
            endIcon={<PencilIcon color="invertedContrast" width={14} height={14} />}
            onClick={() => handleClick(true)}
          >
            {t('Save to the drafts')}
          </Button>
        </>
      ) : (
        <Button
          width="100%"
          variant="secondary"
          disabled={disabled}
          onClick={() => handleClick(true)}
          endIcon={<VolumeIcon color={disabled ? 'textDisabled' : 'primary'} width={20} height={20} />}
        >
          {t('Fill in the page to publish')}
        </Button>
      )}
    </Flex>
  )
}
