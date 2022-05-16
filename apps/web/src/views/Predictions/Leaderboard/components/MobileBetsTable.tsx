import { useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { Flex, Text, ChevronUpIcon, ChevronDownIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PreviousBetsTable from './PreviousBetsTable'

interface MobileBetsTableProps {
  account: string
  token: Token
  api: string
}

const MobileBetsTable: React.FC<MobileBetsTableProps> = ({ account, token, api }) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px="24px"
        py="32px"
        borderBottom="1px solid"
        borderColor="cardBorder"
        style={{ cursor: 'pointer' }}
        onClick={handleToggle}
      >
        <Text as="h5" color="secondary" fontWeight="bold" textTransform="uppercase" fontSize="12px">
          {t('Last %num% Bets', { num: 5 })}
        </Text>
        {isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
      </Flex>
      {isOpen && <PreviousBetsTable account={account} token={token} api={api} />}
    </>
  )
}

export default MobileBetsTable
