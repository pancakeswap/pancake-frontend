import { PaginationButton, Text, Flex, Card, Table, Th, Td, ProfileAvatar } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface DesktopViewProps {
  currentPage: number
  maxPage: number
  setCurrentPage: (value: number) => void
}

const DesktopView: React.FC<React.PropsWithChildren<DesktopViewProps>> = ({ currentPage, maxPage, setCurrentPage }) => {
  const { t } = useTranslation()

  return (
    <Card margin="0 24px">
      <Table>
        <thead>
          <tr>
            <Th width="60px">&nbsp;</Th>
            <Th textAlign="left">{t('User')}</Th>
            <Th textAlign="left">{t('Trading Volume')}</Th>
            <Th textAlign="right">{t('Total Reward')}</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>
              <Text bold color="secondary">
                #1
              </Text>
            </Td>
            <Td textAlign="left">
              <Flex>
                <ProfileAvatar
                  src="https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/twinkle-1000.png"
                  height={42}
                  width={42}
                />
                <Text style={{ alignSelf: 'center' }} color="primary" bold ml="8px">
                  231
                </Text>
              </Flex>
            </Td>
            <Td textAlign="left">
              <Text bold>2331</Text>
            </Td>
            <Td textAlign="right">
              <Text bold>127</Text>
              <Text fontSize={12} color="textSubtle">
                ~1123 CAKE
              </Text>
            </Td>
          </tr>
        </tbody>
      </Table>
      <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
    </Card>
  )
}

export default DesktopView
