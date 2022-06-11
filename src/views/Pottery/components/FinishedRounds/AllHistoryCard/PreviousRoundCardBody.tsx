import styled from 'styled-components'
import { Box, Flex, Text, CardBody, CardRibbon, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from 'components/Divider'
import { getBscScanLink } from 'utils'
import Winner from './Winner'

const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const WinnersContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px 0 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 316px;
    flex-direction: row;
    margin: 0 0 0 32px;
  }
`

const PreviousRoundCardBody: React.FC = () => {
  const { t } = useTranslation()

  return (
    <StyledCardBody>
      <StyledCardRibbon text={t('Latest')} />
      <Flex flexDirection={['column']} width="100%">
        <Flex flexDirection={['column', 'column', 'row']}>
          <Text style={{ alignSelf: 'center' }} fontSize="20px" bold>
            {t('Winner')}
          </Text>
          <WinnersContainer>
            <Winner />
            <Winner />
            <Winner />
            <Winner />
            <Winner />
            <Winner />
            <Winner />
            <Winner />
          </WinnersContainer>
        </Flex>
        <Box width="100%">
          <Divider />
        </Box>
      </Flex>
      <Flex flexDirection="column" width="100%" mt="8px">
        <Text fontSize="20px" textAlign={['center', 'center', 'left']} lineHeight="110%" bold>
          {t('Prize Pot')}
        </Text>
        <Text
          bold
          color="secondary"
          lineHeight="110%"
          fontSize={['32px', '32px', '40px']}
          textAlign={['center', 'center', 'left']}
        >
          ~$2,668,232
        </Text>
        <Text fontSize="14px" textAlign={['center', 'center', 'left']} color="textSubtle" mb="18px">
          212,232 CAKE
        </Text>
        <Flex flexDirection={['column', 'column', 'row']} justifyContent="space-between">
          <Flex alignSelf={['center', 'center', 'flex-end']}>
            <Text fontSize="14px">{t('Total players this round:')}</Text>
            <Text fontSize="14px" bold ml="4px">
              2,890
            </Text>
          </Flex>
          <LinkExternal m={['auto', 'auto', '0px']} href={getBscScanLink('todo.userAddress', 'address')}>
            {t('View on BscScan')}
          </LinkExternal>
        </Flex>
      </Flex>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
