import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'

const domain = 'https://pancakeswap.finance'

export const Step2 = () => {
  const { t } = useTranslation()

  const warningTextAsParts = useMemo(() => {
    const warningText = t("please make sure you're visiting %domain% - check the URL carefully.", { domain })
    return warningText.split(/(https:\/\/pancakeswap.finance)/g)
  }, [t])

  return (
    <Box mr={['6px']}>
      <Text bold as="span" color="warning" textTransform="uppercase" fontSize={['12px', '12px', '14px']}>
        {t('Phishing warning: ')}
      </Text>
      {warningTextAsParts.map((text, i) => (
        <Text
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          as="span"
          bold={text === domain}
          fontSize={['12px', '12px', '14px']}
          color={text === domain ? '#FFFFFF' : '#BDC2C4'}
        >
          {text}
        </Text>
      ))}
    </Box>
  )
}
