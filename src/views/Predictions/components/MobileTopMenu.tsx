import React from 'react'
import styled from 'styled-components'
import { Box, Card, Flex, HelpIcon, IconButton, Image, Text } from '@rug-zombie-libs/uikit'
import FlexRow from './FlexRow'
import { PricePairLabel, TimerLabel } from './Label'
import PrevNextNav from './PrevNextNav'
import HistoryButton from './HistoryButton'

const SetCol = styled.div`
  flex: none;
  width: auto;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 270px;
  }
`

const HelpButtonWrapper = styled.div`
  order: 1;
  margin: 0 8px 0 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 2;
    margin: 0 0 0 8px;
  }
`

const TimerLabelWrapper = styled.div`
  order: 2;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
  }
`

const HistoryButtonWrapper = styled.div`
  display: none;
  order: 3;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: initial;
  }
`

const Token = styled(Box)`
  margin-top: -24px;
  position: absolute;
  top: 50%;
  z-index: 30;

  & > svg {
    height: 48px;
    width: 48px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: -32px;

    & > svg {
      height: 64px;
      width: 64px;
    }
  }
`

const Title = styled(Text)`
  font-size: 16px;
  line-height: 21px;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 20px;
    line-height: 22px;
  }
`

const Label = styled(Card)`
  align-items: ${({ dir }) => (dir === 'right' ? 'flex-end' : 'flex-start')};
  border-radius: '16px 16px 16px 48px';
  display: flex;
  flex-direction: column;
  overflow: initial;
  padding: ${({ dir }) => (dir === 'right' ? '0 28px 0 8px' : '0 8px 0 24px')};

  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: center;
    border-radius: 16px;
    flex-direction: row;
    padding: ${({ dir }) => (dir === 'right' ? '8px 40px 8px 8px' : '8px 8px 8px 40px')};
  }
`

interface MenuProps {
  userInfo: any
}


const MobileTopMenu: React.FC<MenuProps> = ({userInfo}) => {
  return (
    <FlexRow alignItems="center" p="16px">
      <SetCol>
        <Box pl='28px' position='relative'>
          <Token style={{ position: 'relative', top: '35px', right: '25px' }}>
            <Image src='/images/rugZombie/BasicZombie.png' width={50} height={50} alt='ZMBE' />
          </Token>

          <Label>
            <Title bold textTransform='uppercase'>
              MAUSOLEUM (BETA)
            </Title>
          </Label>
        </Box>
      </SetCol>
    </FlexRow>
  )
}

export default MobileTopMenu
