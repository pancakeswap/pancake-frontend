import {
  Box,
  Card,
  CardBody,
  CardHeader,
  ExpandableButton,
  Flex,
  Text,
  TokenPairImage as UITokenPairImage,
} from '@pancakeswap/uikit'
import { ActionContainer } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { vaultPoolConfig } from 'config/constants/pools'
import { DeserializedPool, VaultKey } from 'state/types'

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

interface IfoPoolVaultCardMobileProps {
  pool: DeserializedPool
}

const IfoPoolVaultCardMobile: React.FC<IfoPoolVaultCardMobileProps> = ({ pool }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <StyledCardMobile isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <StyledTokenContent alignItems="center" flex={1}>
            <UITokenPairImage width={24} height={24} {...vaultPoolConfig[VaultKey.IfoPool].tokenImage} />
            <Box ml="8px">
              <Text small bold>
                {t('IFO CAKE')}
              </Text>
              <Text color="textSubtle" fontSize="12px">
                {t('Stake')} CAKE
              </Text>
            </Box>
          </StyledTokenContent>
          <StyledTokenContent flexDirection="column" flex={1}>
            <Text color="textSubtle" fontSize="12px">
              {t('%asset% Staked', { asset: 'CAKE' })}
            </Text>
            {/* <Balance small bold decimals={3} value={stakedBalance} /> */}
          </StyledTokenContent>
          <ExpandableButton expanded={isExpanded} onClick={() => setIsExpanded((prev) => !prev)} />
        </Flex>
      </CardHeader>
      {isExpanded && (
        <>
          <StyledCardBody>
            <ActionContainer>
              <h1>123</h1>
            </ActionContainer>
          </StyledCardBody>
        </>
      )}
    </StyledCardMobile>
  )
}

export default IfoPoolVaultCardMobile
