import { useTranslation } from '@pancakeswap/localization'
import { ERC20Token } from '@pancakeswap/sdk'
import { Button, Flex, HelpIcon, Link, Tag, Text, useToast, useTooltip } from '@pancakeswap/uikit'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { tokenListFromOfficialsUrlsAtom } from 'state/lists/hooks'
import useSWRImmutable from 'swr/immutable'
import { fetchRiskToken } from 'views/Swap/hooks/fetchTokenRisk'

interface AccessRiskProps {
  token: ERC20Token
}

const AccessRisk: React.FC<AccessRiskProps> = ({ token }) => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()
  const tokenMap = useAtomValue(tokenListFromOfficialsUrlsAtom)

  const [retry, setRetry] = useState(false)

  const { data, mutate, error, isLoading } = useSWRImmutable(['risk', token.chainId, token.address], () => {
    return fetchRiskToken(token.address, token.chainId)
  })

  // Tooltips
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Risk scan results are provided by a third party, AvengerDAO.')}</Text>
      <Text my="8px">
        {t(
          'It is a tool for indicative purposes only to allow users to check the reference risk level of a BNB Chain Smart Contract. Please do your own research - interactions with any BNB Chain Smart Contract is at your own risk. Click here for more information on AvengerDAO.',
        )}
      </Text>
      <Flex mt="4px">
        <Text>{t('Learn more about risk rating')}</Text>
        <Link ml="4px" external href="https://www.hashdit.io/en">
          {t('here.')}
        </Link>
      </Flex>
    </>,
    { placement: 'bottom' },
  )

  if (data) {
    return (
      <Flex justifyContent="flex-end">
        <Tag>{t('%riskLevel% Risk', { riskLevel: data.riskLevel })}</Tag>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
    )
  }

  return (
    <>
      <Flex justifyContent="flex-end">
        <Button
          variant="bubblegum"
          scale="xs"
          style={{ textTransform: 'uppercase' }}
          // disabled={disabledButton}
          // onClick={handleScan}
        >
          {isLoading ? t('scanning...') : t('scan risk')}
        </Button>
        {tooltipVisible && tooltip}
        <Flex ref={targetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </Flex>
      </Flex>
    </>
  )
}

export default AccessRisk
