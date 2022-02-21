import { Table, Td, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

export default function NoOrderTable() {
  const { t } = useTranslation()

  return (
    <Table>
      <tbody>
        <tr>
          <Td>
            <Text textAlign="center">{t('No Order')}</Text>
          </Td>
        </tr>
      </tbody>
    </Table>
  )
}
