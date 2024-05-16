import { useTranslation } from '@pancakeswap/localization'
import { Button, CalenderIcon, Flex, PencilIcon, VolumeIcon } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'

export const SubmitAction = () => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const disabled = true

  return (
    <Flex flexDirection="column" mt="30px">
      {query.id ? (
        <>
          <Button width="100%" variant="secondary" endIcon={<CalenderIcon color="primary" width={20} height={20} />}>
            {t('Save and schedule')}
          </Button>
          <Button width="100%" mt="8px" endIcon={<PencilIcon color="invertedContrast" width={14} height={14} />}>
            {t('Save to the drafts')}
          </Button>
        </>
      ) : (
        <Button
          width="100%"
          variant="secondary"
          disabled={disabled}
          endIcon={<VolumeIcon color={disabled ? 'textDisabled' : 'primary'} width={20} height={20} />}
        >
          {t('Fill in the page to publish')}
        </Button>
      )}
    </Flex>
  )
}
