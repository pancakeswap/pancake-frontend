import {
  Box,
  Card,
  CardBody,
  CardHeader,
  ExpandableButton,
  Flex,
  Text,
  useMatchBreakpoints,
  Message,
  Button,
} from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { TokenPairImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useState } from 'react'
import styled from 'styled-components'
import { ActionContainer } from 'views/Pools/components/PoolsTable/ActionPanel/styles'

const StyledCardMobile = styled(Card)`
  max-width: 400px;
  width: 100%;
`

const StyledTokenContent = styled(Flex)`
  ${Text} {
    line-height: 1.2;
    white-space: nowrap;
  }
`

const StyledCardBody = styled(CardBody)`
  display: grid;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.dropdown};
  gap: 16px;
  ${ActionContainer} {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.invertedContrast};
  }
`

const IfoPoolVaultCardMobile: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <TokenPairImage width={24} height={24} primaryToken={tokens.cake} secondaryToken={tokens.cake} />
            <Box ml="8px">
              <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
                {t('Staked')}
              </Text>
              <Text small bold>
                IFO CAKE
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Stake')} CAKE
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('CAKE staked')}
            </Text>
            <Balance small bold decimals={3} value={20} />
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <>
          <StyledCardBody>
            <Message variant="warning" mb="20px">
              <Flex flexDirection="column">
                <Text mb="16px">
                  {t(
                    'This is the old IFO CAKE pool. Check out the brand new CAKE pool to learn how to earn CAKE rewards with higher APY while enjoying other benefits.',
                  )}
                </Text>
                <Flex ml="-34px">
                  {/* Migrate */}
                  <Button width="100%">{t('Go to new CAKE pool')}</Button>
                </Flex>
              </Flex>
            </Message>
            <ActionContainer>
              <Box>
                <Flex mb="4px">
                  <Text fontSize="12px" color="secondary" bold mr="2px">{`${t('CAKE')}`}</Text>
                  <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
                    {t('Staked')}
                  </Text>
                </Flex>
                <Text fontSize="20px" bold>
                  1,483.450
                </Text>
              </Box>
              <Box mt="24px">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text fontSize="14px">{`${t('Recent CAKE profit')}:`}</Text>
                  <Text fontSize="14px" color="textDisabled" bold>
                    0
                  </Text>
                </Flex>
              </Box>
            </ActionContainer>
          </StyledCardBody>
        </>
      )}
    </StyledCardMobile>
  )
}

const IfoPoolVaultCard = () => {
  const { isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanTablet = isMd || isXs || isSm
  if (isSmallerThanTablet) {
    return <IfoPoolVaultCardMobile />
  }

  return <>New Layout</>
}

export default IfoPoolVaultCard
