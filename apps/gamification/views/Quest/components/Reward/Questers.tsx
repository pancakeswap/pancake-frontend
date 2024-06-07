import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { AssetSet } from 'views/Quest/components/Reward/AssetSet'
// import jazzicon from '@metamask/jazzicon'

const TextBlock = styled(Flex)`
  position: absolute;
  top: calc(50% - 1px);
  right: 16px;
  z-index: 2;
  padding: 2px 0;
  transform: translateY(-50%);
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: -28px;
    width: 28px;
    height: 100%;
    background: ${({ theme }) =>
      `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${theme.colors.backgroundAlt} 100%)`};
  }
`

export const Questers = () => {
  const { t } = useTranslation()
  // const icon = useMemo(() => account && jazzicon(iconSize, parseInt(account.slice(2, 10), 16)), [account, iconSize])

  return (
    <Card style={{ width: '100%' }}>
      <Flex padding="16px">
        <AssetSet size={28} />
        <TextBlock m="auto">
          <Text bold>999+ questers</Text>
        </TextBlock>
      </Flex>
    </Card>
  )
}
