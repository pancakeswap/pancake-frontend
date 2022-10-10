import styled from 'styled-components'
import { Flex, Image, Text } from '@pancakeswap/uikit'

export const StyledSortButton = styled.button`
  border: none;
  cursor: pointer;
  background: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
`

export const TableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  min-width: 320px;
  overflow-x: auto;
`

export const NftImage = styled(Image)`
  flex: none;
  & > img {
    border-radius: 8px;
  }
`

export const ClickableRow = styled.tr`
  cursor: pointer;

  &:hover {
    td {
      opacity: 0.65;
    }
  }
`

export const NftName: React.FC<React.PropsWithChildren<{ thumbnailSrc: string; name: string }>> = ({
  thumbnailSrc,
  name,
}) => (
  <Flex alignItems="center">
    <NftImage src={thumbnailSrc} width={48} height={48} mr="8px" />
    <Text>{name}</Text>
  </Flex>
)
